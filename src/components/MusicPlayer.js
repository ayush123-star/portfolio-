"use client";

import { useEffect, useRef, useState } from "react";

/* ================================================================
   🎵 AMBIENT LO-FI MUSIC PLAYER
   - Plays a calming, warm Lo-Fi chill ambient soundscape
   - Uses Web Audio API synthesizer (zero external downloads, 100% reliable)
   - Supports custom audio file if provided via `src`
   - One-click ON / OFF toggle with animated equalizer visualizer
   ================================================================ */

class AmbientLoFiEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.isPlaying = false;
    this.timer = null;
  }

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.2);

      // Warm Lo-Fi low-pass filter (cuts harsh highs for cozy warm tape feel)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(520, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isPlaying = true;
      this.playChords();
    } catch {
      // Fallback gracefully if Web Audio is blocked
    }
  }

  playChords() {
    if (!this.isPlaying || !this.ctx) return;

    // Peaceful Lo-Fi Dream Chords: Fmaj7 -> G6 -> Em7 -> Am7
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 329.63], // G6
      [164.81, 196.0, 246.94, 293.66], // Em7
      [110.0, 164.81, 220.0, 261.63], // Am7
    ];

    let chordIndex = 0;
    const chordDuration = 3.8;

    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = chords[chordIndex % chords.length];
      chordIndex++;

      freqs.forEach((freq, i) => {
        try {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          // Sine & triangle mix for warm electric piano / Rhodes tone
          osc.type = i === 0 ? "sine" : i % 2 === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, now);

          // Gentle envelope: soft attack, sustained body, smooth fade
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.065, now + 0.7);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration + 0.6);

          osc.connect(noteGain);
          noteGain.connect(this.filter);

          osc.start(now);
          osc.stop(now + chordDuration + 0.7);
        } catch {}
      });

      this.timer = setTimeout(playNext, (chordDuration - 0.25) * 1000);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        setTimeout(() => {
          try {
            if (this.ctx && this.ctx.state === "running") this.ctx.suspend();
          } catch {}
        }, 700);
      } catch {}
    }
  }
}

export default function MusicPlayer({ src = "", title = "Lo-Fi Ambient Chill" }) {
  const [playing, setPlaying] = useState(false);
  const synthRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio file player if src is provided
    if (src) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.35;
      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audioRef.current = audio;
    } else {
      synthRef.current = new AmbientLoFiEngine();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, [src]);

  const toggle = () => {
    if (playing) {
      // Turn OFF
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
      setPlaying(false);
      try {
        localStorage.setItem("pf-music", "0");
      } catch {}
    } else {
      // Turn ON
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else {
        if (!synthRef.current) {
          synthRef.current = new AmbientLoFiEngine();
        }
        synthRef.current.start();
      }
      setPlaying(true);
      try {
        localStorage.setItem("pf-music", "1");
      } catch {}
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MUSIC_CSS }} />
      <button
        type="button"
        className={`music-btn${playing ? " on" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Turn background sound OFF" : "Turn background sound ON"}
        title={playing ? `${title} (Click to pause)` : `${title} (Click to play)`}
      >
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="mono music-label">
          {playing ? "SOUND: ON" : "SOUND: OFF"}
        </span>
      </button>
    </>
  );
}

const MUSIC_CSS = `
.music-btn{
  position:fixed;
  left:22px;
  bottom:22px;
  z-index:90;
  display:flex;
  align-items:center;
  gap:10px;
  background:var(--bg2);
  color:var(--text);
  border:1px solid var(--line2);
  border-radius:999px;
  padding:10px 18px;
  cursor:pointer;
  box-shadow:0 12px 32px -8px rgba(0,0,0,.35);
  font-size:12px;
  font-weight:700;
  letter-spacing:1.2px;
  transition:all .3s cubic-bezier(.2,.8,.2,1);
  backdrop-filter:blur(8px);
}
.music-btn:hover{
  border-color:var(--accent);
  transform:translateY(-2px);
  box-shadow:0 16px 36px -10px rgba(var(--acc-rgb),.4);
}
.music-btn.on{
  border-color:var(--accent);
  background:color-mix(in srgb,var(--bg2) 88%,var(--accent) 12%);
  box-shadow:0 0 24px -4px rgba(var(--acc-rgb),.45);
}
.music-bars{
  display:flex;
  align-items:flex-end;
  gap:2.5px;
  height:14px;
}
.music-bars i{
  display:block;
  width:3px;
  height:100%;
  border-radius:2px;
  background:var(--muted);
  transform:scaleY(.35);
  transform-origin:bottom;
  transition:background-color .3s,transform .3s;
}
.music-btn.on .music-bars i{
  background:var(--accent);
  animation:eqBar .8s ease-in-out infinite alternate;
}
.music-btn.on .music-bars i:nth-child(1){animation-delay:.05s}
.music-btn.on .music-bars i:nth-child(2){animation-delay:-.25s}
.music-btn.on .music-bars i:nth-child(3){animation-delay:-.55s}
.music-btn.on .music-bars i:nth-child(4){animation-delay:-.15s}
@keyframes eqBar{
  from{transform:scaleY(.25)}
  to{transform:scaleY(1)}
}
.music-label{
  font-size:11.5px;
  font-weight:700;
}
@media (prefers-reduced-motion: reduce){
  .music-btn.on .music-bars i{animation:none;transform:scaleY(.8)}
}
`;
