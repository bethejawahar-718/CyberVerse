
const API_BASE = "https://cyberverse-bqt0.onrender.com/api";

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const message = document.getElementById("loginMessage");
        message.textContent = "Logging in...";
        message.className = "form-message";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            sessionStorage.setItem("cyberverseToken", data.token);
            sessionStorage.setItem(
                "cyberverseUser",
                JSON.stringify(data.user)
            );

            message.textContent = "Login successful!";
            message.classList.add("success");

            window.location.href = "dashboard.html";

        } catch (error) {
            message.textContent = error.message ||
                "Server connection failed.";
            message.classList.add("error");
        }
    });
}


// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const message = document.getElementById("registerMessage");
        message.textContent = "";
        message.className = "form-message";

        const username = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.classList.add("error");
            return;
        }

        message.textContent = "Creating account...";

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            message.textContent =
                "Account created successfully! Please login.";
            message.classList.add("success");

            registerForm.reset();

        } catch (error) {
            message.textContent = error.message ||
                "Server connection failed.";
            message.classList.add("error");
        }
    });
}
