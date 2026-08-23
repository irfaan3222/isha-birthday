// Wax-Sealed Love Letter Modal Logic

(function() {
    const envelopeBtn = document.getElementById('openLetterBtn');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const letterModal = document.getElementById('letterModal');
    const closeLetterBtn = document.getElementById('closeLetterModalBtn');

    function openLetter() {
        if (!letterModal) return;

        // Sparkle confetti effect on seal break
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#f59e0b', '#fbbf24', '#ff85a2', '#ffffff']
            });
        }

        letterModal.classList.add('modal-open');
    }

    function closeLetter() {
        if (letterModal) {
            letterModal.classList.remove('modal-open');
        }
    }

    if (envelopeBtn) {
        envelopeBtn.addEventListener('click', openLetter);
    }

    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', (e) => {
            if (e.target.id === 'openLetterBtn' || envelopeBtn.contains(e.target)) return;
            openLetter();
        });
    }

    if (closeLetterBtn) {
        closeLetterBtn.addEventListener('click', closeLetter);
    }

    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) closeLetter();
        });
    }
})();
