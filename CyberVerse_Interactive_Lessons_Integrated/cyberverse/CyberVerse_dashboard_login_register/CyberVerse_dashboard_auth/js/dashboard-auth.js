
const API_BASE = "http://localhost:5000/api";

// CHECK LOGIN SESSION
async function checkDashboardAuth() {
    const token = sessionStorage.getItem("cyberverseToken");

    // Login avvakapothe login page ki redirect
    if (!token) {
        window.location.replace("login.html");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/user/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Session expired");
        }

        const data = await response.json();

        console.log("CyberVerse user profile:", data);

        // Logged-in user's name display
        const user = data.user || data;
        const nameElement = document.getElementById("userName");

        if (nameElement && user.username) {
            nameElement.textContent = user.username;
        }

    } catch (error) {
        console.error("Authentication error:", error);

        sessionStorage.removeItem("cyberverseToken");
        sessionStorage.removeItem("cyberverseUser");

        window.location.replace("login.html");
    }
}


// LOGOUT FUNCTION
window.logout = function () {
    sessionStorage.removeItem("cyberverseToken");
    sessionStorage.removeItem("cyberverseUser");

    localStorage.removeItem("cyberverseToken");
    localStorage.removeItem("cyberverseUser");

    window.location.replace("login.html");
};


// START AUTHENTICATION CHECK
checkDashboardAuth();
