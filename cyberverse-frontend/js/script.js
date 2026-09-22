document.addEventListener("DOMContentLoaded", () => {

    initializeMatrix();

    const mentorBtn = document.getElementById("mentorBtn");

    if (mentorBtn) {

        mentorBtn.addEventListener("click", () => {

            alert(
                "AI Mentor is ready! Connect an AI API later to make this feature fully functional."
            );

        });

    }


    /* STAT COUNTERS */

    const stats = document.querySelectorAll(".stat-card h2");

    stats.forEach(stat => {

        const original = stat.textContent.trim();

        if (!/^\d+$/.test(original)) {
            return;
        }

        const target = parseInt(original);

        let current = 0;

        const increment = Math.max(
            1,
            Math.ceil(target / 40)
        );

        const timer = setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            stat.textContent = current;

        }, 30);

    });

});


/* MATRIX EFFECT */

function initializeMatrix() {

    const canvas =
        document.getElementById("matrixCanvas");

    if (!canvas) {
        return;
    }


    const ctx = canvas.getContext("2d");


    function resizeCanvas() {

        canvas.width = window.innerWidth;

        canvas.height = window.innerHeight;

    }


    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    const characters =
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%";

    const fontSize = 14;

    let columns =
        Math.floor(
            canvas.width / fontSize
        );


    let drops =
        Array(columns).fill(1);


    function drawMatrix() {

        ctx.fillStyle =
            "rgba(5, 8, 7, 0.08)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#39ff8e";

        ctx.font =
            `${fontSize}px monospace`;


        for (
            let i = 0;
            i < drops.length;
            i++
        ) {

            const character =
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];


            ctx.fillText(
                character,
                i * fontSize,
                drops[i] * fontSize
            );


            if (
                drops[i] * fontSize >
                    canvas.height &&
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

}
