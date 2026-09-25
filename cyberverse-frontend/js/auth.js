document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initLoginForm();
});

// Update Navbar based on logged-in state
function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        navAuthArea.innerHTML = `
            <span class="user-welcome" style="margin-right: 12px; color: var(--green);">Hi, ${currentUser.name || 'Hacker'}</span>
            <button onclick="logout()" class="btn btn-ghost">Logout</button>
        `;
    } else {
        navAuthArea.innerHTML = `
            <a href="login.html" class="btn btn-ghost">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

// Handle Login Form Submission
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("formError");

        if (errorDiv) errorDiv.textContent = "";

        // Retrieve registered users array or mock standard login
        const users = JSON.parse(localStorage.getItem("cyberverse_users")) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser || (email && password.length >= 6)) {
            // Save session
            const userSession = foundUser || { name: email.split('@')[0], email: email };
            localStorage.setItem("currentUser", JSON.stringify(userSession));

            // Redirect back to home or dashboard page
            window.location.href = "index.html";
        } else {
            if (errorDiv) {
                errorDiv.style.color = "var(--red)";
                errorDiv.style.marginTop = "10px";
                errorDiv.textContent = "Invalid email or password. Please try again.";
            }
        }
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
}
