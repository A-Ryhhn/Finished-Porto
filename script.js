const badge = document.getElementById("badge");

let drag = false;
let startX = 0;
let startY = 0;

let x = 0;
let y = 0;
let targetX = 0;
let targetY = 0;

let rotation = 3;
let targetRotation = 3;

function animate() {
    // Posisi tetap diperbarui saat kartu ditarik
    x += (targetX - x) * (drag ? 0.45 : 0.10);
    y += (targetY - y) * (drag ? 0.45 : 0.10);

    rotation += (targetRotation - rotation) * 0.12;

    const isMobile = window.innerWidth <= 700;
    const scale = isMobile ? 0.48 : 1;

    badge.style.transform =
        `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`;

    requestAnimationFrame(animate);
}

badge.addEventListener("pointerdown", (e) => {
    drag = true;

    startX = e.clientX - x;
    startY = e.clientY - y;

    badge.classList.add("dragging");
    badge.setPointerCapture(e.pointerId);
});

badge.addEventListener("pointermove", (e) => {
    if (!drag) return;

    targetX = Math.max(-120, Math.min(120, e.clientX - startX));
    targetY = Math.max(-80, Math.min(80, e.clientY - startY));

    targetRotation = 3 + targetX * 0.06;
});

function stopDrag() {
    if (!drag) return;

    drag = false;

    badge.classList.remove("dragging");

    targetX = 0;
    targetY = 0;
    targetRotation = 3;
}

badge.addEventListener("pointerup", stopDrag);
badge.addEventListener("pointercancel", stopDrag);

animate();

// Navigation
const links = [...document.querySelectorAll(".header nav a")];
const sections = [...document.querySelectorAll("section[id]")];

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
            link.classList.toggle(
                "active",
                link.hash === `#${entry.target.id}`
            );
        });
    });
}, { threshold: 0.45 });

sections.forEach(section => observer.observe(section));
