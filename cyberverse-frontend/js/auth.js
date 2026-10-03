// CyberVerse auth: DEMO ONLY.
// Accounts are stored in this browser's localStorage, never on a server.
// Passwords are salted and hashed (PBKDF2) before saving, and the login
// only works for accounts that were actually registered in this browser.

const USERS_KEY = "cyberverse_users";
const SESSION_KEY = "currentUser";
const MIN_PASSWORD_LENGTH = 8;

document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initLoginForm();
    initRegisterForm();
    loadDashboardData();
});

/* ---------- small helpers ---------- */

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
        return fallback; // corrupted storage should not break the site
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        return false;
    }
}

function makeEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function fieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value : "";
}

function showError(message) {
    const errorDiv = document.getElementById("formError");
    if (!errorDiv) return;
    errorDiv.style.color = "var(--red)";
    errorDiv.textContent = message;
}

function clearError() {
    const errorDiv = document.getElementById("formError");
    if (errorDiv) errorDiv.textContent = "";
}

function getCurrentUser() {
    const user = readJSON(SESSION_KEY, null);
    return user && user.email ? user : null;
}

function displayNameOf(user) {
    return user.fullName || user.name || user.email.split("@")[0];
}

/* ---------- password hashing (demo-grade) ---------- */

function toHex(bytes) {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return toHex(bytes);
}

async function hashPassword(password, salt) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
        key,
        256
    );
    return toHex(new Uint8Array(bits));
}

function hashingAvailable() {
    return !!(window.crypto && window.crypto.subtle);
}

/* ---------- 1. Navigation bar ---------- */

function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    navAuthArea.textContent = "";
    const currentUser = getCurrentUser();

    if (currentUser) {
        const welcome = makeEl("span", "user-welcome", "Hi, " + displayNameOf(currentUser));
        welcome.style.marginRight = "12px";
        welcome.style.color = "var(--green)";

        const dashboardLink = makeEl("a", "btn btn-primary", "Dashboard");
        dashboardLink.href = "dashboard.html";
        dashboardLink.style.marginRight = "8px";

        const logoutButton = makeEl("button", "btn btn-ghost", "Logout");
        logoutButton.type = "button";
        logoutButton.addEventListener("click", logout);

        navAuthArea.append(welcome, dashboardLink, logoutButton);
    } else {
        const loginLink = makeEl("a", "btn btn-ghost", "Login");
        loginLink.href = "login.html";

        const registerLink = makeEl("a", "btn btn-primary", "Register");
        registerLink.href = "register.html";

        navAuthArea.append(loginLink, registerLink);
    }
}

/* ---------- 2. Registration ---------- */

function initRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError();

        const fullName = fieldValue("fullName").trim();
        const email = fieldValue("email").trim().toLowerCase();
        const password = fieldValue("password");
        const confirmPassword = fieldValue("confirmPassword");

        if (!fullName) return showError("Please enter your name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Please enter a valid email address.");
        if (password !== confirmPassword) return showError("Passwords do not match.");
        if (password.length < MIN_PASSWORD_LENGTH) {
            return showError("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long.");
        }
        if (!hashingAvailable()) {
            return showError("This page must be opened over https:// to register.");
        }

        const users = readJSON(USERS_KEY, []);
        if (users.some((u) => u.email && u.email.toLowerCase() === email)) {
            return showError("An account with this email already exists.");
        }

        const salt = randomSalt();
        const passwordHash = await hashPassword(password, salt);
        users.push({ fullName, email, salt, passwordHash });

        if (!writeJSON(USERS_KEY, users)) {
            return showError("Could not save your account. Please allow site storage in your browser.");
        }

        window.location.href = "login.html";
    });
}

/* ---------- 3. Login ---------- */

function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError();

        const email = fieldValue("email").trim().toLowerCase();
        const password = fieldValue("password");

        if (!email || !password) return showError("Enter your email and password.");
        if (!hashingAvailable()) return showError("This page must be opened over https:// to log in.");

        const users = readJSON(USERS_KEY, []);
        const index = users.findIndex((u) => u.email && u.email.toLowerCase() === email);
        const user = users[index];
        let loggedIn = false;

        if (user && user.passwordHash) {
            loggedIn = (await hashPassword(password, user.salt)) === user.passwordHash;
        } else if (user && typeof user.password === "string" && user.password === password.trim()) {
            // Account saved by the old version (plain-text password): upgrade it to a hash.
            const salt = randomSalt();
            users[index] = {
                fullName: user.fullName,
                email: user.email.toLowerCase(),
                salt,
                passwordHash: await hashPassword(password.trim(), salt),
            };
            writeJSON(USERS_KEY, users);
            loggedIn = true;
        }

        if (!loggedIn) return showError("Invalid email or password.");

        // Only public details go in the session, never the password or hash.
        writeJSON(SESSION_KEY, { fullName: user.fullName, email: user.email.toLowerCase() });
        window.location.href = "dashboard.html";
    });
}

/* ---------- 4. Dashboard ---------- */

function loadDashboardData() {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (!userNameElement) return;

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    userNameElement.textContent = displayNameOf(currentUser);
    if (userEmailElement) {
        userEmailElement.textContent = currentUser.email;
        userEmailElement.style.color = "var(--muted)";
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
}

/* ---------- 5. Logout ---------- */

function logout() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (err) {
        /* ignore */
    }
    window.location.href = "index.html";
}
