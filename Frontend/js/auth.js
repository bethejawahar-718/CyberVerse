// Talks to the CyberVerse backend (see js/config.js for the API base URL).
// Session is a JWT returned by /api/login, stored in localStorage alongside
// the logged-in user's basic profile info.

const API_BASE_URL = window.CYBERVERSE_API_BASE_URL;
const TOKEN_KEY = "cyberverse_token";
const USER_KEY = "currentUser";

document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initLoginForm();
    initRegisterForm();
    loadDashboardData();
    initLogoutButton();
});

// ---- small helpers -------------------------------------------------------

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (networkError) {
        const error = new Error("Could not reach the server. Please check your connection and try again.");
        error.cause = networkError;
        throw error;
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // no JSON body — leave data as null
    }

    if (!response.ok) {
        throw new Error((data && data.message) || `Request failed (${response.status})`);
    }

    return data;
}

// 0. Wire up the logout button wherever it appears (dashboard, roadmaps, courses, labs, ai-mentors)
function initLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// 1. Update Navigation Bar
function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    const currentUser = getCurrentUser();

    if (currentUser) {
        const displayName = currentUser.username || currentUser.fullName || currentUser.name || currentUser.email.split('@')[0];
        navAuthArea.innerHTML = `
            <span class="user-welcome" style="margin-right: 12px; color: var(--green);">Hi, ${displayName}</span>
            <a href="dashboard.html" class="btn btn-primary" style="margin-right: 8px;">Dashboard</a>
            <button onclick="logout()" class="btn btn-ghost">Logout</button>
        `;
    } else {
        navAuthArea.innerHTML = `
            <a href="login.html" class="btn btn-ghost">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

// 2. Handle Registration Form Submission (calls POST /api/register, then redirects to login)
function initRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const errorDiv = document.getElementById("formError");
        const submitBtn = registerForm.querySelector("button[type=submit]");

        if (errorDiv) {
            errorDiv.textContent = "";
            errorDiv.style.color = "var(--red)";
        }

        if (password !== confirmPassword) {
            if (errorDiv) errorDiv.textContent = "Passwords do not match.";
            return;
        }

        if (password.length < 6) {
            if (errorDiv) errorDiv.textContent = "Password must be at least 6 characters long.";
            return;
        }

        if (submitBtn) submitBtn.disabled = true;

        try {
            await apiRequest("/register", {
                method: "POST",
                body: { username: fullName, email, password }
            });

            window.location.href = "login.html";
        } catch (err) {
            if (errorDiv) errorDiv.textContent = err.message;
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// 3. Handle Login Form Submission (calls POST /api/login, stores JWT + user)
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("formError");
        const submitBtn = loginForm.querySelector("button[type=submit]");

        if (errorDiv) errorDiv.textContent = "";
        if (submitBtn) submitBtn.disabled = true;

        try {
            const data = await apiRequest("/login", {
                method: "POST",
                body: { email, password }
            });

            setSession(data.token, data.user);
            window.location.href = "dashboard.html";
        } catch (err) {
            if (errorDiv) {
                errorDiv.style.color = "var(--red)";
                errorDiv.textContent = err.message || "Invalid email or password.";
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// 4. Load Dynamic User Info on Dashboard Page (verifies the JWT against /api/user/profile)
function loadDashboardData() {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (!userNameElement) return;

    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    apiRequest("/user/profile", { auth: true })
        .then(({ user }) => {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            userNameElement.textContent = user.username || user.email.split('@')[0];
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
                userEmailElement.style.color = "var(--muted)";
            }
        })
        .catch(() => {
            // Token missing/expired/invalid — send the user back to log in.
            clearSession();
            window.location.href = "login.html";
        });
}

// 5. Logout Handler
function logout() {
    clearSession();
    window.location.href = "index.html";
}
