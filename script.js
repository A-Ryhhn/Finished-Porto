const badge = document.getElementById("badge");
const idCard = document.querySelector(".id-card");

let dragging = false;
let startX = 0;
let startY = 0;
let x = 0;
let y = 0;
let targetX = 0;
let targetY = 0;
let rotation = 3;
let targetRotation = 3;

idCard.addEventListener("pointerdown", (e) => {
    e.preventDefault();

    dragging = true;

    startX = e.clientX - x;
    startY = e.clientY - y;

    idCard.setPointerCapture(e.pointerId);
    idCard.style.cursor = "grabbing";
});

idCard.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    e.preventDefault();

    targetX = Math.max(-120, Math.min(120, e.clientX - startX));
    targetY = Math.max(-80, Math.min(80, e.clientY - startY));

    x = targetX;
    y = targetY;

    targetRotation = 3 + x * 0.06;

    updateCard();
});

function updateCard() {
    const scale = window.innerWidth <= 700 ? 0.48 : 1;

    badge.style.transform =
        `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`;

    rotation += (targetRotation - rotation) * 0.15;
}

function releaseCard() {
    if (!dragging) return;

    dragging = false;

    targetX = 0;
    targetY = 0;
    targetRotation = 3;

    idCard.style.cursor = "grab";

    returnHome();
}

function returnHome() {
    if (dragging) return;

    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    rotation += (targetRotation - rotation) * 0.12;

    updateCard();

    if (Math.abs(x) > 0.2 || Math.abs(y) > 0.2 ||
        Math.abs(rotation - 3) > 0.1) {
        requestAnimationFrame(returnHome);
    } else {
        x = 0;
        y = 0;
        rotation = 3;
        updateCard();
    }
}

idCard.addEventListener("pointerup", releaseCard);
idCard.addEventListener("pointercancel", releaseCard);
