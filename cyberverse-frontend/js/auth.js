document.addEventListener("DOMContentLoaded", () => {

    initializeMatrixBackground();

    setupRegister();

    setupLogin();

    setupDashboard();

    setupLogout();

    setupModuleButtons();

});


/* ================================
   REGISTER
================================ */

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("registerName")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("registerConfirm")
                .value;


        const error =
            document.getElementById("registerError");


        error.textContent = "";


        if (password !== confirmPassword) {

            error.textContent =
                "Passwords do not match.";

            return;

        }


        if (password.length < 6) {

            error.textContent =
                "Password must contain at least 6 characters.";

            return;

        }


        const existingUser =
            localStorage.getItem("cyberverseUser");


        if (existingUser) {

            const user =
                JSON.parse(existingUser);


            if (user.email === email) {

                error.textContent =
                    "An account with this email already exists.";

                return;

            }

        }


        const user = {

            name: name,

            email: email,

            password: password,

            completedLessons: 0,

            completedLabs: 0,

            quizScore: 0

        };


        localStorage.setItem(
            "cyberverseUser",
            JSON.stringify(user)
        );


        alert(
            "Account created successfully!"
        );


        window.location.href =
            "login.html";

    });

}


/* ================================
   LOGIN
================================ */

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        const error =
            document.getElementById("loginError");


        error.textContent = "";


        const savedUser =
            localStorage.getItem("cyberverseUser");


        if (!savedUser) {

            error.textContent =
                "No account found. Please register first.";

            return;

        }


        const user =
            JSON.parse(savedUser);


        if (
            user.email !== email ||
            user.password !== password
        ) {

            error.textContent =
                "Incorrect email or password.";

            return;

        }


        localStorage.setItem(
            "cyberverseLoggedIn",
            "true"
        );


        window.location.href =
            "dashboard.html";

    });

}


/* ================================
   DASHBOARD
================================ */

function setupDashboard() {

    const userName =
        document.getElementById("userName");


    if (!userName) {
        return;
    }


    const loggedIn =
        localStorage.getItem(
            "cyberverseLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "login.html";

        return;

    }


    const savedUser =
        localStorage.getItem(
            "cyberverseUser"
        );


    if (!savedUser) {

        window.location.href =
            "register.html";

        return;

    }


    const user =
        JSON.parse(savedUser);


    document.getElementById(
        "userName"
    ).textContent = user.name;


    document.getElementById(
        "userEmail"
    ).textContent = user.email;


    document.getElementById(
        "completedLessons"
    ).textContent =
        user.completedLessons;


    document.getElementById(
        "completedLabs"
    ).textContent =
        user.completedLabs;


    document.getElementById(
        "quizScore"
    ).textContent =
        `${user.quizScore}%`;


    updateProgress(user);

}


/* ================================
   PROGRESS
================================ */

function updateProgress(user) {

    const totalLessons = 42;

    const progress =
        Math.min(
            100,
            Math.round(
                (user.completedLessons /
                    totalLessons) *
                100
            )
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${progress}% completed`;

    }

}


/* ================================
   LOGOUT
================================ */

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "cyberverseLoggedIn"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* ================================
   MODULE BUTTONS
================================ */

function setupModuleButtons() {

    const buttons =
        document.querySelectorAll(
            ".module-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                alert(
                    "This learning module will be added soon."
                );

            }
        );

    });

}


/* ================================
   MATRIX BACKGROUND
================================ */

function initializeMatrixBackground() {

    const canvas =
        document.getElementById(
            "matrixCanvas"
        );


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    function resize() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    const characters =
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    const fontSize = 14;


    let columns =
        Math.floor(
            canvas.width /
            fontSize
        );


    let drops =
        Array(columns).fill(1);


    function draw() {

        ctx.fillStyle =
            "rgba(5,8,7,0.08)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#39ff8e";


        ctx.font =
            `${fontSize}px monospace`;


        for (
            let i = 0;
            i < drops.length;
            i++
        ) {

            const text =
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];


            ctx.fillText(
                text,
                i * fontSize,
                drops[i] * fontSize
            );


            if (
                drops[i] *
                    fontSize >
                    canvas.height &&
                Math.random() > 0.975
            ) {

                drops[i] = 0;

            }


            drops[i]++;

        }

    }


    setInterval(
        draw,
        45
    );

}
