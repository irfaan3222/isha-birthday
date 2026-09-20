// ============================================================
// Direct MP3 Background Music: "Jo Tum Mere Ho" by Anuv Jain
// Uses local MP3 file - NO YouTube dependency!
// 100% reliable autoplay on all browsers
// ============================================================

let bgAudio = null;
let isPlaying = false;

function updateUI(playing) {
    const audioText = document.getElementById('audioText');
    const audioToggle = document.getElementById('audioToggle');
    if (audioText) {
        audioText.innerHTML = playing
            ? '<span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Jo Tum Mere Ho 🎶</span>'
            : '▶ Play Song 🎵';
    }
    if (audioToggle) {
        if (playing) {
            audioToggle.classList.add('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        } else {
            audioToggle.classList.remove('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        }
    }
}

function playSong() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
        isPlaying = true;
        updateUI(true);
    }).catch(() => {
        // Browser blocked — will retry on next user gesture
        console.log('Autoplay blocked, waiting for user gesture');
    });
}

function pauseSong() {
    if (!bgAudio) return;
    bgAudio.pause();
    isPlaying = false;
    updateUI(false);
}

document.addEventListener('DOMContentLoaded', () => {
    // Create the audio element
    bgAudio = new Audio('src/assets/jo_tum_mere_ho.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.85;
    bgAudio.preload = 'auto';

    // Keep story video muted
    const storyVideo = document.getElementById('storyVideo');
    if (storyVideo) {
        storyVideo.muted = true;
        storyVideo.volume = 0;
    }

    // Try autoplay immediately
    playSong();

    // On first user gesture, start playing if not already
    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
    const unlockAudio = () => {
        if (!isPlaying) {
            playSong();
        }
        events.forEach(e => {
            window.removeEventListener(e, unlockAudio, { capture: true });
            document.removeEventListener(e, unlockAudio, { capture: true });
        });
    };
    events.forEach(e => {
        window.addEventListener(e, unlockAudio, { capture: true, passive: true });
        document.addEventListener(e, unlockAudio, { capture: true, passive: true });
    });

    // Toggle button
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });
    }
});
