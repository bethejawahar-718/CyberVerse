document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("cyberverse_user"));

    const navAuthArea = document.getElementById("navAuthArea");
    if (navAuthArea) {
        if (currentUser) {
            navAuthArea.innerHTML = `
                <a href="dashboard.html" class="btn btn-outline">Dashboard</a>
            `;
        }
    }

    if (window.location.pathname.includes("dashboard.html")) {
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        const userNameEl = document.getElementById("userName");
        const userEmailEl = document.getElementById("userEmail");

        if (userNameEl) userNameEl.textContent = currentUser.name || "Student";
        if (userEmailEl) userEmailEl.textContent = currentUser.email || "";

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("cyberverse_user");
                window.location.href = "index.html";
            });
        }
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const formError = document.getElementById("formError");

            if (!email || !password) {
                if (formError) formError.textContent = "Please fill in all fields.";
                return;
            }

            const user = {
                name: email.split("@")[0],
                email: email
            };

            localStorage.setItem("cyberverse_user", JSON.stringify(user));
            window.location.href = "dashboard.html";
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const formError = document.getElementById("formError");

            if (!fullName || !email || !password) {
                if (formError) formError.textContent = "Please fill in all fields.";
                return;
            }

            const user = {
                name: fullName,
                email: email
            };

            localStorage.setItem("cyberverse_user", JSON.stringify(user));
            window.location.href = "dashboard.html";
        });
    }
});
