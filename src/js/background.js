// Subtle Pastel Particle Canvas: Delicate Pink & Sky Blue Hearts and Soft Bokeh

(function() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 35); // Clean & minimal count

    // Pastel palette: Soft Rose, Baby Pink, Powder Blue, Lavender
    const colors = [
        'rgba(244, 63, 94, ',   // Soft Rose
        'rgba(251, 113, 133, ', // Pastel Rose
        'rgba(253, 164, 175, ', // Blush Pink
        'rgba(56, 189, 248, ',  // Baby Sky Blue
        'rgba(147, 197, 253, ', // Soft Blue
        'rgba(216, 180, 254, '  // Soft Lilac
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height;
            this.size = Math.random() * 6 + 3;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.35 + 0.15; // Gentle subtle opacity
            this.pulseSpeed = Math.random() * 0.015 + 0.005;
            this.isHeart = Math.random() > 0.45;
            this.rotation = Math.random() * Math.PI * 2;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.003;

            if (this.y < -25 || this.opacity <= 0) {
                this.reset();
                this.y = height + 20;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color + Math.max(0, Math.min(0.6, this.opacity)) + ')';

            if (this.isHeart) {
                const s = this.size / 9;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-4 * s, -4 * s, -8 * s, 1.5 * s, 0, 8 * s);
                ctx.bezierCurveTo(8 * s, 1.5 * s, 4 * s, -4 * s, 0, 0);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * height;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
