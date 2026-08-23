// ============================================================
// Romantic Background Song: "Jo Tum Mere Ho"
// YouTube Video ID: KT6zXHpb7P0
// Strategy: Start MUTED (always allowed), then silently unmute
// ============================================================

let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let hasAutoStarted = false;

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
        ytPlayer.setVolume(85);
        ytPlayer.playVideo();
        isPlaying = true;
        hasAutoStarted = true;
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

// ---------- YouTube IFrame API Callback ----------
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: 'KT6zXHpb7P0',
        playerVars: {
            autoplay: 1,
            mute: 1,          // start muted — browsers always allow muted autoplay
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            loop: 1,
            playlist: 'KT6zXHpb7P0',
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3
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
    // Step 1: Make sure it's muted and playing
    try {
        event.target.mute();
        event.target.playVideo();
    } catch (e) {}

    // Step 2: After short delay, silently unmute → music plays!
    setTimeout(() => {
        try {
            if (ytPlayer && ytReady) {
                ytPlayer.unMute();
                ytPlayer.setVolume(85);
                isPlaying = true;
                hasAutoStarted = true;
                updateUI(true);
            }
        } catch (e) {
            // Silently wait for first user interaction
            setupSilentFallback();
        }
    }, 1000);
}

function onPlayerStateChange(event) {
    // Loop: restart when video ends
    if (event.data === YT.PlayerState.ENDED) {
        try {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
        } catch (e) {}
    }
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updateUI(true);
    } else if (event.data === YT.PlayerState.PAUSED && hasAutoStarted) {
        isPlaying = false;
        updateUI(false);
    }
}

function onPlayerError(e) {
    console.log('YouTube player error, waiting for interaction');
    setupSilentFallback();
}

// ---------- Silent Fallback (no visible hint) ----------
// On first user interaction, silently start music
function setupSilentFallback() {
    if (hasAutoStarted) return;
    const tryPlay = () => {
        if (hasAutoStarted) return;
        playAudio();
    };
    ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'].forEach(evt => {
        window.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
}

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
                playAudio();
            }
        });
    }

    // Safety net: if YouTube API never loads, setup fallback
    setTimeout(() => {
        if (!ytReady) {
            setupSilentFallback();
        }
    }, 4000);
});
