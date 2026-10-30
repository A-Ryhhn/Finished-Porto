const badge = document.getElementById("badge");
const lanyard = document.querySelector(".lanyard");
const idCard = document.querySelector(".id-card");

let drag = false;

let startX = 0;
let startY = 0;

let targetX = 0;
let targetY = 0;

let x = 0;
let y = 0;

let velocityX = 0;
let velocityY = 0;

let rotation = 7;
let targetRotation = 7;

let lastX = 0;
let lastY = 0;
let lastTime = 0;

const spring = 0.08;
const damping = 0.82;

function animate() {
    if (!drag) {
        const forceX = targetX - x;
        const forceY = targetY - y;

        velocityX += forceX * spring;
        velocityY += forceY * spring;

        velocityX *= damping;
        velocityY *= damping;

        x += velocityX;
        y += velocityY;

        targetRotation = 7 + x * 0.035;
    }

    rotation += (targetRotation - rotation) * 0.12;

    const isMobile = window.innerWidth <= 700;
    const scale = isMobile ? 0.48 : 1;
    const baseRotation = isMobile ? 0 : 3;

    badge.style.transform =
        `translate3d(${x}px, ${y}px, 0)
         scale(${scale})
         rotate(${rotation + baseRotation}deg)`;

    if (lanyard) {
        const ropeRotation = Math.max(
            -14,
            Math.min(14, x * 0.18)
        );

        lanyard.style.transform =
            `rotate(${ropeRotation}deg)`;
    }

    if (idCard) {
        const cardRotation = Math.max(
            -10,
            Math.min(
                10,
                velocityX * 0.8 + x * 0.025
            )
        );

        idCard.style.transform =
            `rotate(${cardRotation}deg)`;
    }

    requestAnimationFrame(animate);
}

badge.addEventListener("pointerdown", (e) => {
    drag = true;

    startX = e.clientX - x;
    startY = e.clientY - y;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = performance.now();

    velocityX = 0;
    velocityY = 0;

    badge.classList.add("dragging");

    badge.setPointerCapture(e.pointerId);
});

badge.addEventListener("pointermove", (e) => {
    if (!drag) return;

    const now = performance.now();
    const deltaTime = Math.max(1, now - lastTime);

    const newX = e.clientX - startX;
    const newY = e.clientY - startY;

    velocityX =
        ((e.clientX - lastX) / deltaTime) * 16;

    velocityY =
        ((e.clientY - lastY) / deltaTime) * 16;

    targetX = Math.max(-100, Math.min(100, newX));
    targetY = Math.max(-60, Math.min(60, newY));

    x += (targetX - x) * 0.35;
    y += (targetY - y) * 0.35;

    targetRotation =
        7 + Math.max(
            -8,
            Math.min(8, x * 0.04)
        );

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
});

function up() {
    if (!drag) return;

    drag = false;

    badge.classList.remove("dragging");

    targetX = 0;
    targetY = 0;
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
