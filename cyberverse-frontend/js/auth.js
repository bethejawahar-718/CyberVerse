document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
});

function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    // Check if user is logged in (e.g., stored in localStorage)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // Optional: Show user profile / logout if logged in
        navAuthArea.innerHTML = `
            <span class="user-welcome">Hi, ${currentUser.name || 'Hacker'}</span>
            <button onclick="logout()" class="btn btn-ghost">Logout</button>
        `;
    } else {
        // Display Login and Register buttons when NOT logged in
        navAuthArea.innerHTML = `
            <a href="login.html" class="btn btn-ghost">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
}
