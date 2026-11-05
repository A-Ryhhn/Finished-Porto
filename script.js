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

    // Hitung posisi awal berdasarkan posisi pointer dikurangi offset x/y saat ini
    startX = e.clientX - x;
    startY = e.clientY - y;

    idCard.setPointerCapture(e.pointerId);
    idCard.style.cursor = "grabbing";
});

idCard.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    e.preventDefault();

    // Batasi pergerakan (clamp)
    targetX = Math.max(-120, Math.min(120, e.clientX - startX));
    targetY = Math.max(-80, Math.min(80, e.clientY - startY));

    x = targetX;
    y = targetY;

    // Ubah target rotasi berdasarkan posisi geser x
    targetRotation = 3 + x * 0.06;
    rotation = targetRotation; // Langsung set agar responsif saat digeser

    updateCard();
});

function updateCard() {
    const scale = window.innerWidth <= 700 ? 0.48 : 1;

    badge.style.transform =
        `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`;
}

function releaseCard(e) {
    if (!dragging) return;

    dragging = false;

    // Set target kembali ke posisi awal (x=0, y=0, rotasi=3)
    targetX = 0;
    targetY = 0;
    targetRotation = 3;

    idCard.style.cursor = "grab";

    try {
        idCard.releasePointerCapture(e.pointerId);
    } catch (err) {}

    requestAnimationFrame(returnHome);
}

function returnHome() {
    if (dragging) return;

    // Animasi pelan-pelan mendekati target (0,0)
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    rotation += (targetRotation - rotation) * 0.12;

    updateCard();

    // Lanjutkan animasi selama belum benar-benar kembali ke titik awal
    if (Math.abs(x - targetX) > 0.2 || Math.abs(y - targetY) > 0.2 ||
        Math.abs(rotation - targetRotation) > 0.1) {
        requestAnimationFrame(returnHome);
    } else {
        x = targetX;
        y = targetY;
        rotation = targetRotation;
        updateCard();
    }
}

idCard.addEventListener("pointerup", releaseCard);
idCard.addEventListener("pointercancel", releaseCard);
