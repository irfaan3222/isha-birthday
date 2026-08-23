// Main Script: Icon initialization, Card Flips, Mobile Menu, Mouse Sparkles

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIconOpen = document.getElementById('menuIconOpen');
    const menuIconClose = document.getElementById('menuIconClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                if (menuIconOpen) menuIconOpen.classList.add('hidden');
                if (menuIconClose) menuIconClose.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                if (menuIconOpen) menuIconOpen.classList.remove('hidden');
                if (menuIconClose) menuIconClose.classList.add('hidden');
            }
        });

        // Close menu on navigation click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIconOpen) menuIconOpen.classList.remove('hidden');
                if (menuIconClose) menuIconClose.classList.add('hidden');
            });
        });
    }

    // 3. Interactive Reason Cards Flip
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            if (card.classList.contains('flipped') && typeof confetti === 'function') {
                const rect = card.getBoundingClientRect();
                confetti({
                    particleCount: 15,
                    spread: 30,
                    origin: {
                        x: (rect.left + rect.width / 2) / window.innerWidth,
                        y: (rect.top + rect.height / 2) / window.innerHeight
                    },
                    colors: ['#f43f5e', '#38bdf8', '#fda4af']
                });
            }
        });
    });

    // 4. Subtle Mouse Move Sparkle Trail (Desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
        let lastSparkleTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSparkleTime < 120) return;
            lastSparkleTime = now;

            createSparkleTrail(e.clientX, e.clientY);
        });

        function createSparkleTrail(x, y) {
            const sparkle = document.createElement('div');
            sparkle.className = 'fixed pointer-events-none z-50 text-rose-400 text-xs transition-all duration-700 select-none';
            sparkle.style.left = (x - 6) + 'px';
            sparkle.style.top = (y - 6) + 'px';
            sparkle.innerHTML = Math.random() > 0.5 ? '🌸' : '✨';

            document.body.appendChild(sparkle);

            requestAnimationFrame(() => {
                sparkle.style.transform = `translate(${(Math.random() - 0.5) * 24}px, -${Math.random() * 30 + 15}px) scale(0)`;
                sparkle.style.opacity = '0';
            });

            setTimeout(() => sparkle.remove(), 700);
        }
    }
});
