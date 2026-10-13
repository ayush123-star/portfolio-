"use client";

import { useEffect, useRef, useState } from "react";

// 🎵 Background music — visitors ke liye ek chhota play/pause button.
// Browser autoplay block karta hai, isliye pehli baar visitor ko button dabana padta hai.
// src khali ho to kuch render nahi hota.
export default function MusicPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audioRef.current = audio;

    // Pehle se play ho raha tha to try karo (browser agar block kare to koi error nahi)
    try {
      if (localStorage.getItem("pf-music") === "1")
        audio.play().catch(() => {});
    } catch {}

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      try {
        localStorage.setItem("pf-music", "1");
      } catch {}
    } else {
      audio.pause();
      try {
        localStorage.setItem("pf-music", "0");
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
        aria-label={playing ? "Music band karo" : "Background music chalao"}
        title={title || "Background music"}
      >
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">{playing ? "PAUSE" : "MUSIC"}</span>
      </button>
    </>
  );
}

const MUSIC_CSS = `
.music-btn{position:fixed;left:18px;bottom:18px;z-index:60;display:flex;align-items:center;gap:9px;background:var(--bg2);color:var(--text);border:1px solid var(--line2);border-radius:999px;padding:9px 15px;cursor:pointer;box-shadow:var(--card-shadow);font-size:12px;letter-spacing:1.5px}
.music-btn:hover{border-color:var(--accent)}
.music-bars{display:flex;align-items:flex-end;gap:2px;height:12px}
.music-bars i{display:block;width:3px;height:100%;border-radius:2px;background:var(--accent);transform:scaleY(.4);transform-origin:bottom}
.music-btn.on .music-bars i{animation:eq .9s ease-in-out infinite alternate}
.music-btn.on .music-bars i:nth-child(2){animation-delay:-.3s}
.music-btn.on .music-bars i:nth-child(3){animation-delay:-.6s}
@keyframes eq{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion: reduce){.music-btn.on .music-bars i{animation:none}}
`;
