const badge = document.getElementById("badge");

let drag = false;
let sx = 0;
let sy = 0;
let x = 0;
let y = 0;
let r = 7;

badge.addEventListener("pointerdown", (e) => {
    drag = true;
    sx = e.clientX;
    sy = e.clientY;

    badge.classList.add("dragging");
    badge.setPointerCapture(e.pointerId);
});

badge.addEventListener("pointermove", (e) => {
    if (!drag) return;

    const dx = e.clientX - sx;
    const dy = e.clientY - sy;

    x = Math.max(-80, Math.min(80, dx * 0.7));
    y = Math.max(-45, Math.min(45, dy * 0.5));
    r = 7 + Math.max(-5, Math.min(5, dx * 0.04));

    badge.style.transform =
        `translate(${x}px, ${y}px) rotate(${r}deg)`;
});

function up() {
    drag = false;

    badge.classList.remove("dragging");

    x *= 0.18;
    y *= 0.18;
    r = 7 + (r - 7) * 0.18;

    badge.style.transform =
        `translate(${x}px, ${y}px) rotate(${r}deg)`;
}

badge.addEventListener("pointerup", up);
badge.addEventListener("pointercancel", up);


const links = [
    ...document.querySelectorAll(".header nav a")
];

const secs = [
    ...document.querySelectorAll("section[id]")
];


new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                links.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.hash === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    {
        threshold: 0.45
    }
).observe(document.querySelector("#home"));


secs.forEach((section) => {
    new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    links.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.hash === `#${entry.target.id}`
                        );
                    });
                }
            });
        },
        {
            threshold: 0.45
        }
    ).observe(section);
});