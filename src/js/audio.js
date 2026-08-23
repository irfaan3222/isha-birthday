// Romantic Background Song Controller: "Jo Tum Mere Ho" by Anuv Jain (ilNt2bikxDI)
// Configured to start by default!

let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let audioCtx = null;
let synthTimer = null;
let hasAutoStarted = false;

// Fallback synth notes for Jo Tum Mere Ho
const joTumHoNotes = [
    293.66, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66,
    392.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00, 329.63,
    293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 246.94
];
let noteIndex = 0;

function playSynthNote(freq) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.3);
}

function startSynthMelody() {
    if (synthTimer) clearInterval(synthTimer);
    synthTimer = setInterval(() => {
        if (!isPlaying) return;
        const freq = joTumHoNotes[noteIndex % joTumHoNotes.length];
        playSynthNote(freq);
        noteIndex++;
    }, 550);
}

function startFallbackSynth() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    startSynthMelody();
}

function updateUI(playing) {
    const audioText = document.getElementById('audioText');
    const audioToggle = document.getElementById('audioToggle');
    if (audioText) {
        audioText.textContent = playing ? "Playing: Jo Tum Mere Ho 🎶" : "Play Song (Jo Tum Mere Ho) 🎵";
    }
    if (audioToggle) {
        if (playing) {
            audioToggle.classList.add('border-rose-400', 'bg-pink-100/80');
        } else {
            audioToggle.classList.remove('border-rose-400', 'bg-pink-100/80');
        }
    }
}

function playAudio() {
    isPlaying = true;
    updateUI(true);

    if (ytPlayer && ytReady && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.playVideo();
        } catch (e) {
            startFallbackSynth();
        }
    } else {
        startFallbackSynth();
    }
}

function pauseAudio() {
    isPlaying = false;
    updateUI(false);

    if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
        try {
            ytPlayer.pauseVideo();
        } catch (e) {}
    }
    if (synthTimer) clearInterval(synthTimer);
}

// YouTube IFrame API Ready Callback
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: 'ilNt2bikxDI', // "Jo Tum Mere Ho" by Anuv Jain
        playerVars: {
            'autoplay': 1,
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'loop': 1,
            'playlist': 'ilNt2bikxDI'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    ytReady = true;
    // Attempt automatic playback
    try {
        event.target.playVideo();
        isPlaying = true;
        updateUI(true);
    } catch (err) {
        console.log("Autoplay waiting for user interaction");
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updateUI(true);
        if (synthTimer) clearInterval(synthTimer); // Stop synth if YT is playing
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const audioToggle = document.getElementById('audioToggle');
    const storyVideo = document.getElementById('storyVideo');

    // Keep video muted
    if (storyVideo) {
        storyVideo.muted = true;
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    // Browser Autoplay Policy Handler:
    // Starts the music automatically on the very first user interaction (click/touch/scroll) if blocked initially
    const triggerAutoStart = () => {
        if (!hasAutoStarted) {
            hasAutoStarted = true;
            playAudio();
        }
    };

    window.addEventListener('click', triggerAutoStart, { once: true });
    window.addEventListener('touchstart', triggerAutoStart, { once: true });
    window.addEventListener('scroll', triggerAutoStart, { once: true });
    window.addEventListener('keydown', triggerAutoStart, { once: true });

    // Initial attempt
    setTimeout(() => {
        if (!hasAutoStarted && ytReady) {
            playAudio();
        }
    }, 800);
});
