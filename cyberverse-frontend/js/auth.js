/* =========================================
   CYBERVERSE AUTH SYSTEM
========================================= */

const USER_KEY = "cyberverseUser";
const LOGIN_KEY = "cyberverseLoggedIn";


/* =========================================
   REGISTER
========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const gender =
            document.getElementById("registerGender").value;

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("registerConfirm").value;

        const error =
            document.getElementById("registerError");


        /* VALIDATION */

        if (!gender) {

            error.textContent =
                "Please select an avatar.";

            return;
        }


        if (password.length < 6) {

            error.textContent =
                "Password must contain at least 6 characters.";

            return;
        }


        if (password !== confirmPassword) {

            error.textContent =
                "Passwords do not match.";

            return;
        }


        /* CREATE USER */

        const user = {

            name: name,

            email: email,

            password: password,

            gender: gender,

            completedLessons: 0,

            completedLabs: 0,

            quizScore: 0

        };


        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        );


        localStorage.removeItem(LOGIN_KEY);


        /* REDIRECT */

        window.location.href = "login.html";

    });

}


/* =========================================
   LOGIN
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const error =
            document.getElementById("loginError");


        const savedUser =
            JSON.parse(
                localStorage.getItem(USER_KEY)
            );


        if (!savedUser) {

            error.textContent =
                "No account found. Please register first.";

            return;
        }


        if (
            savedUser.email !== email ||
            savedUser.password !== password
        ) {

            error.textContent =
                "Incorrect email or password.";

            return;
        }


        /* LOGIN SUCCESS */

        localStorage.setItem(
            LOGIN_KEY,
            "true"
        );


        window.location.href =
            "dashboard.html";

    });

}


/* =========================================
   DASHBOARD
========================================= */

const dashboardPage =
    document.querySelector(".dashboard-page");


if (dashboardPage) {

    const loggedIn =
        localStorage.getItem(LOGIN_KEY);

    const user =
        JSON.parse(
            localStorage.getItem(USER_KEY)
        );


    /* PROTECT DASHBOARD */

    if (loggedIn !== "true" || !user) {

        window.location.href =
            "login.html";

    } else {

        /* USER NAME */

        const userName =
            document.getElementById("userName");

        if (userName) {

            userName.textContent =
                user.name;

        }


        /* USER EMAIL */

        const userEmail =
            document.getElementById("userEmail");

        if (userEmail) {

            userEmail.textContent =
                user.email;

        }


        /* SIDEBAR NAME */

        const sidebarName =
            document.getElementById(
                "sidebarUserName"
            );

        if (sidebarName) {

            sidebarName.textContent =
                user.name;

        }


        /* TOP NAME */

        const topName =
            document.getElementById(
                "topUserName"
            );

        if (topName) {

            topName.textContent =
                user.name;

        }


        /* =====================================
           AVATAR
        ====================================== */

        const avatar =
            document.getElementById(
                "sidebarAvatar"
            );


        if (avatar) {

            if (user.gender === "female") {

                /*
                   GIRL DEFAULT AVATAR
                */

                avatar.src =
                    "https://api.dicebear.com/9.x/adventurer/svg?seed=Girl";


            } else {

                /*
                   BOY DEFAULT AVATAR
                */

                avatar.src =
                    "https://api.dicebear.com/9.x/adventurer/svg?seed=Boy";

            }

        }


        /* =====================================
           STATISTICS
        ====================================== */

        const completedLessons =
            document.getElementById(
                "completedLessons"
            );

        const completedLabs =
            document.getElementById(
                "completedLabs"
            );

        const quizScore =
            document.getElementById(
                "quizScore"
            );


        if (completedLessons) {

            completedLessons.textContent =
                user.completedLessons || 0;

        }


        if (completedLabs) {

            completedLabs.textContent =
                user.completedLabs || 0;

        }


        if (quizScore) {

            quizScore.textContent =
                (user.quizScore || 0) + "%";

        }


        /* =====================================
           PROGRESS
        ====================================== */

        const progress =
            Math.min(
                100,
                Math.round(
                    ((user.completedLessons || 0) / 5) * 100
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
                progress + "%";

        }


        if (progressText) {

            progressText.textContent =
                progress + "% completed";

        }

    }

}


/* =========================================
   LOGOUT
========================================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                LOGIN_KEY
            );

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================
   MODULE BUTTONS
========================================= */

const moduleButtons =
    document.querySelectorAll(
        ".module-btn"
    );


moduleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            USER_KEY
                        )
                    );


                if (!user) return;


                if (
                    user.completedLessons <
                    5
                ) {

                    user.completedLessons++;

                }


                localStorage.setItem(
                    USER_KEY,
                    JSON.stringify(user)
                );


                button.textContent =
                    "Completed ✓";

                button.disabled = true;


                const completedLessons =
                    document.getElementById(
                        "completedLessons"
                    );

                const progressFill =
                    document.getElementById(
                        "progressFill"
                    );

                const progressText =
                    document.getElementById(
                        "progressText"
                    );


                if (completedLessons) {

                    completedLessons.textContent =
                        user.completedLessons;

                }


                const progress =
                    Math.round(
                        (user.completedLessons / 5) *
                        100
                    );


                if (progressFill) {

                    progressFill.style.width =
                        progress + "%";

                }


                if (progressText) {

                    progressText.textContent =
                        progress + "% completed";

                }

            }
        );

    }
);


/* =========================================
   MATRIX EFFECT
========================================= */

const matrixCanvas =
    document.getElementById(
        "matrixCanvas"
    );


if (matrixCanvas) {

    const ctx =
        matrixCanvas.getContext("2d");

    let width =
        matrixCanvas.width =
        window.innerWidth;

    let height =
        matrixCanvas.height =
        window.innerHeight;


    const letters =
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%";


    const fontSize = 14;

    let columns =
        Math.floor(
            width / fontSize
        );


    let drops =
        Array(columns).fill(1);


    function drawMatrix() {

        ctx.fillStyle =
            "rgba(0, 8, 5, 0.08)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        ctx.fillStyle =
            "#39ff8e";

        ctx.font =
            fontSize + "px monospace";


        for (
            let i = 0;
            i < drops.length;
            i++
        ) {

            const text =
                letters[
                    Math.floor(
                        Math.random() *
                        letters.length
                    )
                ];


            ctx.fillText(
                text,
                i * fontSize,
                drops[i] * fontSize
            );


            if (
                drops[i] * fontSize >
                    height &&
                Math.random() > 0.975
            ) {

                drops[i] = 0;

            }


            drops[i]++;

        }

    }


    setInterval(
        drawMatrix,
        45
    );


    window.addEventListener(
        "resize",
        function () {

            width =
                matrixCanvas.width =
                window.innerWidth;

            height =
                matrixCanvas.height =
                window.innerHeight;

            columns =
                Math.floor(
                    width / fontSize
                );

            drops =
                Array(columns).fill(1);

        }
    );

}