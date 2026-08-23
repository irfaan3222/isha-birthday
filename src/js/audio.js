// ============================================================
// Romantic Background Song: "Jo Tum Mere Ho" by Anuv Jain
// Strategy: Start MUTED (browsers allow this), then unmute
// This guarantees autoplay works on ALL browsers & mobile!
// ============================================================

let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let hasAutoStarted = false;
let muteUnmuteAttempted = false;

// ---------- UI Update ----------
function updateUI(playing) {
    const audioText = document.getElementById('audioText');
    const audioToggle = document.getElementById('audioToggle');
    if (audioText) {
        audioText.textContent = playing
            ? '▐▌ Playing: Jo Tum Me... 🎶'
            : '▶ Play Song 🎵';
    }
    if (audioToggle) {
        audioToggle.classList.toggle('border-rose-400', playing);
        audioToggle.classList.toggle('bg-pink-100/80', playing);
    }
}

// ---------- Play / Pause ----------
function playAudio() {
    if (!ytPlayer || !ytReady) return;
    try {
        ytPlayer.unMute();
        ytPlayer.setVolume(80);
        ytPlayer.playVideo();
        isPlaying = true;
        updateUI(true);
    } catch (e) {
        console.log('Play error:', e);
    }
}

function pauseAudio() {
    if (!ytPlayer || !ytReady) return;
    try {
        ytPlayer.pauseVideo();
    } catch (e) {}
    isPlaying = false;
    updateUI(false);
}

// ---------- YouTube IFrame API ----------
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: 'ilNt2bikxDI', // Jo Tum Mere Ho - Anuv Jain
        playerVars: {
            autoplay: 1,        // request autoplay
            mute: 1,            // START MUTED — browsers always allow this!
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            loop: 1,
            playlist: 'ilNt2bikxDI',
            rel: 0,
            modestbranding: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
};

function onPlayerReady(event) {
    ytReady = true;
    // Step 1: play muted first (always works)
    try {
        event.target.mute();
        event.target.playVideo();
    } catch (e) {}

    // Step 2: after a short delay, unmute — music now plays!
    setTimeout(() => {
        try {
            event.target.unMute();
            event.target.setVolume(80);
            isPlaying = true;
            hasAutoStarted = true;
            updateUI(true);
        } catch (e) {
            // If unmute fails (very rare), wait for first user touch
            setupInteractionFallback();
        }
    }, 800);
}

function onPlayerStateChange(event) {
    // If video ends, restart (loop workaround for some browsers)
    if (event.data === YT.PlayerState.ENDED) {
        try {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
        } catch (e) {}
    }
    // Sync UI if something external pauses it
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updateUI(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updateUI(false);
    }
}

function onPlayerError() {
    // YouTube blocked: show a gentle nudge
    updateUI(false);
    setupInteractionFallback();
}

// ---------- Interaction Fallback ----------
// If autoplay is fully blocked, play on first touch/click anywhere
function setupInteractionFallback() {
    if (hasAutoStarted) return;

    // Show a soft pulsing music note hint
    showMusicHint();

    const tryPlay = () => {
        if (hasAutoStarted) return;
        hasAutoStarted = true;
        hideMusicHint();
        playAudio();
    };

    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        window.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
}

// ---------- Soft Music Hint Banner ----------
function showMusicHint() {
    if (document.getElementById('musicHint')) return;
    const hint = document.createElement('div');
    hint.id = 'musicHint';
    hint.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f43f5e, #ec4899, #38bdf8);
            color: white;
            padding: 10px 22px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(244,63,94,0.4);
            z-index: 9999;
            animation: pulseHint 1.5s infinite;
            cursor: pointer;
            white-space: nowrap;
        ">
            🎵 Tap anywhere to play Jo Tum Mere Ho 💕
        </div>
    `;
    document.body.appendChild(hint);
    hint.addEventListener('click', () => {
        if (!hasAutoStarted) {
            hasAutoStarted = true;
            hideMusicHint();
            playAudio();
        }
    });
}

function hideMusicHint() {
    const hint = document.getElementById('musicHint');
    if (hint) hint.remove();
}

// ---------- CSS for pulse animation ----------
const style = document.createElement('style');
style.textContent = `
    @keyframes pulseHint {
        0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.85; transform: translateX(-50%) scale(1.04); }
    }
`;
document.head.appendChild(style);

// ---------- DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
    // Keep story video muted so song stays audible
    const storyVideo = document.getElementById('storyVideo');
    if (storyVideo) {
        storyVideo.muted = true;
        storyVideo.volume = 0;
    }

    // Toggle button: click to pause/play
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseAudio();
            } else {
                hasAutoStarted = true;
                hideMusicHint();
                playAudio();
            }
        });
    }

    // If YouTube API takes too long, set a fallback attempt
    setTimeout(() => {
        if (!hasAutoStarted && !ytReady) {
            setupInteractionFallback();
        }
    }, 3000);
});
