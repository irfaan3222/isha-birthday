// ============================================================
// Robust Background Music Engine: "Jo Tum Mere Ho"
// Song Video ID: KT6zXHpb7P0 (by Anuv Jain)
// Guaranteed Autoplay on Web & Mobile
// ============================================================

let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let audioUnlocked = false;

// UI Synchronizer
function updateUI(playing) {
    const audioText = document.getElementById('audioText');
    const audioToggle = document.getElementById('audioToggle');
    if (audioText) {
        audioText.textContent = playing
            ? 'Playing: Jo Tum Mere Ho 🎶'
            : 'Play Song (Jo Tum Mere Ho) 🎵';
    }
    if (audioToggle) {
        if (playing) {
            audioToggle.classList.add('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        } else {
            audioToggle.classList.remove('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        }
    }
}

// Master Play Function
function startMusic() {
    isPlaying = true;
    updateUI(true);

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.unMute();
            ytPlayer.setVolume(90);
            ytPlayer.playVideo();
        } catch (e) {
            console.log('Play attempt:', e);
        }
    }
}

// Master Pause Function
function pauseMusic() {
    isPlaying = false;
    updateUI(false);

    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        try {
            ytPlayer.pauseVideo();
        } catch (e) {}
    }
}

// Global Silent Gesture Unlock (instantly triggers on very first touch/scroll/click)
function unlockAndPlay() {
    if (!audioUnlocked) {
        audioUnlocked = true;
        startMusic();
    }
}

// Setup universal user gesture listeners
function setupAutoPlayListeners() {
    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'scroll', 'wheel', 'keydown'];
    const handleFirstGesture = () => {
        unlockAndPlay();
        events.forEach(evt => {
            window.removeEventListener(evt, handleFirstGesture, { capture: true });
            document.removeEventListener(evt, handleFirstGesture, { capture: true });
        });
    };

    events.forEach(evt => {
        window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
        document.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
    });
}

// YouTube IFrame API Callback
window.onYouTubeIframeAPIReady = function () {
    try {
        ytPlayer = new YT.Player('ytPlayer', {
            height: '200',
            width: '200',
            videoId: 'KT6zXHpb7P0',
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: 1,
                modestbranding: 1,
                mute: 0,
                playsinline: 1,
                playlist: 'KT6zXHpb7P0',
                rel: 0
            },
            events: {
                onReady: function (event) {
                    ytReady = true;
                    // Attempt immediate unmuted playback
                    try {
                        event.target.unMute();
                        event.target.setVolume(90);
                        event.target.playVideo();
                        isPlaying = true;
                        updateUI(true);
                    } catch (err) {
                        console.log('Autoplay deferred to first touch:', err);
                    }

                    // Fallback retry after 500ms
                    setTimeout(() => {
                        if (ytPlayer && typeof ytPlayer.getPlayerState === 'function') {
                            const state = ytPlayer.getPlayerState();
                            if (state !== YT.PlayerState.PLAYING) {
                                startMusic();
                            }
                        }
                    }, 500);
                },
                onStateChange: function (event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        isPlaying = true;
                        audioUnlocked = true;
                        updateUI(true);
                    } else if (event.data === YT.PlayerState.ENDED) {
                        // Loop restart
                        try {
                            ytPlayer.seekTo(0);
                            ytPlayer.playVideo();
                        } catch (e) {}
                    } else if (event.data === YT.PlayerState.PAUSED && audioUnlocked) {
                        isPlaying = false;
                        updateUI(false);
                    }
                },
                onError: function (err) {
                    console.log('YouTube Player notice, retrying with playlist:', err);
                }
            }
        });
    } catch (e) {
        console.error('YT init error:', e);
    }
};

// Initial DOM Setup
document.addEventListener('DOMContentLoaded', () => {
    // Keep story video muted so song is always pure and clean
    const storyVideo = document.getElementById('storyVideo');
    if (storyVideo) {
        storyVideo.muted = true;
        storyVideo.volume = 0;
    }

    // Header Music Toggle Button
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseMusic();
            } else {
                audioUnlocked = true;
                startMusic();
            }
        });
    }

    // Enable seamless first-touch audio start
    setupAutoPlayListeners();
});
