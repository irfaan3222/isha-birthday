// Sky Lantern Wish Release Simulator (Pastel Theme)

(function() {
    const launchBtn = document.getElementById('launchLanternBtn');
    const wishInput = document.getElementById('wishInput');
    const stage = document.getElementById('lanternStage');
    const hint = document.getElementById('lanternHint');

    function releaseLantern() {
        const wishText = wishInput.value.trim();
        const textToDisplay = wishText || "Happy Birthday Isha 💕";

        if (hint) hint.style.display = 'none';

        const lantern = document.createElement('div');
        lantern.className = 'floating-lantern px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 text-white font-semibold text-xs shadow-md border border-white flex items-center gap-1.5 z-20';
        
        const driftX = (Math.random() * 60 - 30) + 'px';
        lantern.style.setProperty('--drift-x', driftX);
        lantern.style.left = (15 + Math.random() * 70) + '%';

        lantern.innerHTML = `
            <span>🏮</span>
            <span class="max-w-[140px] truncate">${textToDisplay}</span>
        `;

        stage.appendChild(lantern);
        wishInput.value = '';

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 20,
                spread: 35,
                origin: { y: 0.8 },
                colors: ['#f43f5e', '#38bdf8', '#fda4af']
            });
        }

        setTimeout(() => {
            lantern.remove();
        }, 6500);
    }

    if (launchBtn) {
        launchBtn.addEventListener('click', releaseLantern);
    }

    if (wishInput) {
        wishInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') releaseLantern();
        });
    }
})();
