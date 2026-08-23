// Birthday Cake & Candle Blowing Logic

(function() {
    const blowBtn = document.getElementById('blowCandlesBtn');
    const blowBtnText = document.getElementById('blowBtnText');
    const flames = document.querySelectorAll('.flame');
    const cakeGraphic = document.getElementById('cakeGraphic');
    const modal = document.getElementById('cakeSurpriseModal');
    const closeModalBtn = document.getElementById('closeCakeModalBtn');

    let candlesBlown = false;

    function blowOutCandles() {
        if (candlesBlown) {
            // Re-show surprise modal if already blown
            openModal();
            return;
        }

        candlesBlown = true;

        // Extinguish flames and create smoke particles
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
                createSmoke(flame);
            }, index * 250);
        });

        if (blowBtnText) {
            blowBtnText.textContent = "See Birthday Wish ✨";
        }

        // Trigger Confetti Fireworks after candles extinguished
        setTimeout(() => {
            triggerConfetti();
            openModal();
        }, 900);
    }

    function createSmoke(element) {
        const rect = element.getBoundingClientRect();
        const cakeRect = cakeGraphic.getBoundingClientRect();

        for (let i = 0; i < 4; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            smoke.style.left = (rect.left - cakeRect.left + rect.width / 2 + (Math.random() * 10 - 5)) + 'px';
            smoke.style.top = (rect.top - cakeRect.top - 10) + 'px';
            smoke.style.animationDelay = (i * 0.1) + 's';
            cakeGraphic.appendChild(smoke);

            setTimeout(() => smoke.remove(), 1600);
        }
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            // Burst 1: Left Cannon
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6, x: 0.2 },
                colors: ['#ff85a2', '#ff5c8a', '#a1c4fd', '#ffd3e2', '#ffffff']
            });

            // Burst 2: Right Cannon
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6, x: 0.8 },
                colors: ['#ff85a2', '#ff5c8a', '#a1c4fd', '#ffd3e2', '#ffffff']
            });

            // Burst 3: Stars & Hearts center shower
            setTimeout(() => {
                confetti({
                    particleCount: 120,
                    spread: 100,
                    origin: { y: 0.4 },
                    colors: ['#ff85a2', '#ff3366', '#a1c4fd', '#ffd3e2']
                });
            }, 400);
        }
    }

    function openModal() {
        if (modal) {
            modal.classList.add('modal-open');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('modal-open');
        }
    }

    if (blowBtn) {
        blowBtn.addEventListener('click', blowOutCandles);
    }

    if (cakeGraphic) {
        cakeGraphic.addEventListener('click', blowOutCandles);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
})();
