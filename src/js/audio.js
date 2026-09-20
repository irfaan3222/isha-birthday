// ============================================================
// Ultra-Reliable Background Music Controller: "Jo Tum Mere Ho"
// YouTube Video ID: KT6zXHpb7P0 (Anuv Jain)
// + Web Audio Acoustic Harmonic Engine Fallback
// ============================================================

let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let isMuted = true;
let synthCtx = null;
let synthInterval = null;

// UI Updater
function updateUI(playing) {
    const audioText = document.getElementById('audioText');
    const audioToggle = document.getElementById('audioToggle');
    if (audioText) {
        audioText.innerHTML = playing
            ? '<span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Playing: Jo Tum Mere Ho 🎶</span>'
            : '▶ Play Song (Jo Tum Mere Ho) 🎵';
    }
    if (audioToggle) {
        if (playing) {
            audioToggle.classList.add('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        } else {
            audioToggle.classList.remove('border-rose-400', 'bg-pink-100/90', 'shadow-md');
        }
    }
}

// Master Play
function playSong() {
    isPlaying = true;
    updateUI(true);

    if (ytPlayer && ytReady && typeof ytPlayer.unMute === 'function') {
        try {
            ytPlayer.unMute();
            ytPlayer.setVolume(100);
            ytPlayer.playVideo();
            return;
        } catch (e) {
            console.log('YT play error, switching to synth:', e);
        }
    }
    startAcousticMelody();
}

// Master Pause
function pauseSong() {
    isPlaying = false;
    updateUI(false);

    if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
        try {
            ytPlayer.pauseVideo();
        } catch (e) {}
    }
    stopAcousticMelody();
}

// Romantic Acoustic Harmonic Melody of "Jo Tum Mere Ho" (Web Audio Fallback)
const songNotes = [
    // Verse 1: "Jo tum mere ho..."
    293.66, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66,
    392.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00, 329.63,
    // Chorus: "Batao na kahan jaaoon..."
    293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 246.94,
    293.66, 392.00, 440.00, 493.88, 587.33, 523.25, 493.88, 392.00
];
let currentNoteIndex = 0;

function playAcousticNote(freq) {
    if (!synthCtx || synthCtx.state !== 'running') return;

    const osc = synthCtx.createOscillator();
    const gain = synthCtx.createGain();
    const filter = synthCtx.createBiquadFilter();

    // Warm guitar/piano tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, synthCtx.currentTime);

    // Warm low-pass acoustic resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, synthCtx.currentTime);

    const now = synthCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(synthCtx.destination);

    osc.start(now);
    osc.stop(now + 1.9);
}

function startAcousticMelody() {
    if (!synthCtx) {
        synthCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (synthCtx.state === 'suspended') {
        synthCtx.resume();
    }
    if (synthInterval) clearInterval(synthInterval);
    synthInterval = setInterval(() => {
        if (!isPlaying) return;
        const freq = songNotes[currentNoteIndex % songNotes.length];
        playAcousticNote(freq);
        currentNoteIndex++;
    }, 450);
}

function stopAcousticMelody() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

// User Interaction Trigger (Unlocks audio instantly on first screen interaction)
function triggerAudioUnlock() {
    if (!isPlaying) {
        playSong();
    } else if (ytPlayer && ytReady) {
        try {
            ytPlayer.unMute();
            ytPlayer.setVolume(100);
        } catch (e) {}
    }
}

// Setup universal listeners
function initUserListeners() {
    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'scroll', 'wheel', 'keydown'];
    const unlockHandler = () => {
        triggerAudioUnlock();
        // Remove after successful interaction
        events.forEach(evt => {
            window.removeEventListener(evt, unlockHandler, { capture: true });
            document.removeEventListener(evt, unlockHandler, { capture: true });
        });
    };

    events.forEach(evt => {
        window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
        document.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
}

// YouTube IFrame API Ready Callback
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
                mute: 1, // Start muted for 100% browser autoplay approval
                playsinline: 1,
                playlist: 'KT6zXHpb7P0',
                rel: 0
            },
            events: {
                onReady: function (event) {
                    ytReady = true;
                    // Start muted immediately (browser allows this without gesture)
                    try {
                        event.target.mute();
                        event.target.playVideo();
                    } catch (e) {}

                    // Attempt immediate unmute
                    setTimeout(() => {
                        try {
                            event.target.unMute();
                            event.target.setVolume(100);
                            isPlaying = true;
                            updateUI(true);
                        } catch (e) {
                            console.log('Unmute waiting for user interaction');
                        }
                    }, 600);
                },
                onStateChange: function (event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        isPlaying = true;
                        updateUI(true);
                        stopAcousticMelody(); // YT is playing cleanly
                    } else if (event.data === YT.PlayerState.ENDED) {
                        try {
                            ytPlayer.seekTo(0);
                            ytPlayer.playVideo();
                        } catch (e) {}
                    }
                },
                onError: function (err) {
                    console.log('YouTube API Notice - Activating acoustic harmony fallback:', err);
                    if (isPlaying) {
                        startAcousticMelody();
                    }
                }
            }
        });
    } catch (e) {
        console.error('YT init exception:', e);
    }
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Keep background story video muted
    const storyVideo = document.getElementById('storyVideo');
    if (storyVideo) {
        storyVideo.muted = true;
        storyVideo.volume = 0;
    }

    // Toggle button in header
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

    // Listen for any user gesture to unmute and play
    initUserListeners();

    // Initial play attempt
    setTimeout(() => {
        if (!isPlaying) {
            triggerAudioUnlock();
        }
    }, 1000);
});
