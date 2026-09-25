document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initLoginForm();
    initRegisterForm();
    loadDashboardData();
});

// 1. Update Navigation Bar
function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        const displayName = currentUser.fullName || currentUser.name || currentUser.email.split('@')[0];
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

// 2. Handle Registration Form Submission
function initRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("formError");

        if (errorDiv) errorDiv.textContent = "";

        if (!fullName || !email || !password) {
            if (errorDiv) errorDiv.textContent = "Please fill in all fields.";
            return;
        }

        const users = JSON.parse(localStorage.getItem("cyberverse_users")) || [];

        // Check if email already registered
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            if (errorDiv) {
                errorDiv.style.color = "var(--red)";
                errorDiv.textContent = "An account with this email already exists.";
            }
            return;
        }

        const newUser = { fullName, email, password };
        users.push(newUser);
        localStorage.setItem("cyberverse_users", JSON.stringify(users));

        // Save active user session
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // Redirect directly to Dashboard
        window.location.href = "dashboard.html";
    });
}

// 3. Handle Login Form Submission
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("formError");

        if (errorDiv) errorDiv.textContent = "";

        const users = JSON.parse(localStorage.getItem("cyberverse_users")) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            localStorage.setItem("currentUser", JSON.stringify(foundUser));
            window.location.href = "dashboard.html";
        } else {
            // Fallback for new un-registered inputs
            if (email && password.length >= 6) {
                const sessionUser = { fullName: email.split('@')[0], email: email };
                localStorage.setItem("currentUser", JSON.stringify(sessionUser));
                window.location.href = "dashboard.html";
            } else if (errorDiv) {
                errorDiv.style.color = "var(--red)";
                errorDiv.textContent = "Invalid email or password.";
            }
        }
    });
}

// 4. Load Dynamic Data on Dashboard Page
function loadDashboardData() {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    // Only run if we are on dashboard.html
    if (!userNameElement) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // Display registered full name or email name
        userNameElement.textContent = currentUser.fullName || currentUser.name || currentUser.email.split('@')[0];
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
            userEmailElement.style.color = "var(--muted)";
        }
    } else {
        // Redirect to login if user isn't logged in
        window.location.href = "login.html";
    }

    // Attach listener for logout dropdown button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// 5. Logout Handler
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
