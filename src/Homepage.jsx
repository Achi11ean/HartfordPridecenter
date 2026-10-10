// HomePage.jsx — drop-in replacement. All page styles are included below.
// Existing dependencies: React, react-router-dom and react-icons.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaInstagram, FaFacebook, FaEnvelope, FaCalendarAlt,
  FaHandHoldingHeart, FaUsers, FaArrowRight, FaPlay, FaPause,
  FaVolumeUp, FaVolumeMute, FaChevronLeft, FaChevronRight,
  FaExpand, FaCompress, FaRedo, FaTv, FaHeart, FaBookOpen,
  FaHandsHelping, FaStar, FaPlus, FaMinus,
} from "react-icons/fa";
import "./App.css";
import EmailSubscribe from "./EmailSubscribe";

const RAINBOW = ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"];
// Shared timing keeps the words and welcome progress bar synchronized.
const WORD_DURATION_MS = 600;
const LOVED_HOLD_MS = 1100;
const INTRO_DURATION_MS = 6 * WORD_DURATION_MS + LOVED_HOLD_MS;
const NEON_WORDS = [
  { word: "Seen", color: "#ff8993" },
  { word: "Safe", color: "#ffbb7a" },
  { word: "Celebrated", color: "#ffe680" },
  { word: "Supported", color: "#95e0ae" },
  { word: "Connected", color: "#9ac8ff" },
  { word: "Welcome", color: "#c5a2ff" },
  { word: "Loved", color: "#ffffff" },
];
const PRIDE_FLAGS = [
  { name: "Rainbow Pride", colors: RAINBOW },
  { name: "Transgender Pride", colors: ["#5bcefa", "#f5a9b8", "#fff", "#f5a9b8", "#5bcefa"] },
  { name: "Bisexual Pride", colors: ["#d60270", "#d60270", "#9b4f96", "#0038a8", "#0038a8"] },
  { name: "Lesbian Pride", colors: ["#d52d00", "#ff9a56", "#fff", "#d362a4", "#a30262"] },
  { name: "Pansexual Pride", colors: ["#ff218c", "#ffd800", "#21b1ff"] },
  { name: "Nonbinary Pride", colors: ["#fff430", "#fff", "#9c59d1", "#2c2c2c"] },
  { name: "Asexual Pride", colors: ["#161616", "#a3a3a3", "#fff", "#800080"] },
  { name: "Genderqueer Pride", colors: ["#b57edc", "#fff", "#4a8123"] },
];

// Add another object here to add a channel. Both existing videos are included.
// Keep ids unique. MP4 (H.264/AAC) is a useful delivery format across browsers.
// Optional: poster: "/thumbnail.jpg" and tracks: [{ src, srcLang, label, default }].
export const PRIDE_CHANNELS = [
  { id: "pride", title: "A little Pride. A lot of heart.", category: "Hartford Pride Center", src: "/pridevideo.mp4", description: "A window into our community, our connections, and the joy we share." },
  { id: "karaoverse", title: "Watch what we’re building", category: "Community collaboration", src: "/Video.mov", description: "Explore our featured collaboration with Karaoverse.", href: "https://karaoverse.com", linkLabel: "Explore Karaoverse" },
  // { id: "community-stories", title: "Community stories", category: "Our community", src: "/community-stories.mp4", description: "Meet the people behind the Pride." },
];

const EXPLORE_LINKS = [
  { label: "Services", detail: "Support for your everyday.", to: "/services", color: "#a32d47", wash: "#fce9ec", icon: FaHandHoldingHeart },
  { label: "Resources", detail: "Find your next step.", to: "/resources", color: "#97511c", wash: "#fff0df", icon: FaBookOpen },
  { label: "Events", detail: "Make a little room for joy.", href: "https://karaoverse.com/event/capital-city-pride", color: "#796315", wash: "#fcf5d7", icon: FaCalendarAlt },
  { label: "Volunteer", detail: "Your time makes a difference.", to: "/volunteer", color: "#256645", wash: "#e5f2e8", icon: FaHandsHelping },
  { label: "Sponsors", detail: "Grow something good together.", to: "/sponsors", color: "#345f9c", wash: "#e7effb", icon: FaStar },
  { label: "Donate", detail: "Help belonging bloom.", to: "/support", color: "#795095", wash: "#f0e7f8", icon: FaHeart },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    const update = () => setReduced(media.matches);
    update();
    if (media.addEventListener) media.addEventListener("change", update);
    else media.addListener(update);
    return () => { if (media.removeEventListener) media.removeEventListener("change", update); else media.removeListener(update); };
  }, []);
  return reduced;
}

function RainbowBar({ className = "" }) {
  return <div className={`hpc-rainbow-bar ${className}`} aria-hidden="true">{RAINBOW.map((color) => <span key={color} style={{ backgroundColor: color }} />)}</div>;
}

function PrideFlags() {
  return <div className="hpc-pride-flags">{PRIDE_FLAGS.map((flag, index) => <span key={flag.name} className="hpc-pride-flag" role="img" aria-label={flag.name} title={flag.name} style={{ "--flag-delay": `${index * 100}ms`, "--flag-rotation": `${index % 2 ? 6 : -6}deg` }}>{flag.colors.map((color, i) => <span key={i} style={{ backgroundColor: color }} />)}</span>)}</div>;
}

// One word at a time; the final rainbow "Loved" stays visible.
function NeonWords({ onComplete, active = true }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(reducedMotion ? NEON_WORDS.length - 1 : 0);
  useEffect(() => {
    if (!active) return undefined;
    let step = reducedMotion ? NEON_WORDS.length - 1 : 0;
    setIndex(step);
    let timer;
    const advance = () => {
      if (step < NEON_WORDS.length - 1) {
        step += 1;
        setIndex(step);
        timer = window.setTimeout(advance, step === NEON_WORDS.length - 1 ? LOVED_HOLD_MS : WORD_DURATION_MS);
      } else onComplete?.();
    };
    timer = window.setTimeout(advance, reducedMotion ? LOVED_HOLD_MS : WORD_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, reducedMotion, onComplete]);
  const current = NEON_WORDS[index];
  return <div className="hpc-neon-stage">
    <span className="hpc-sr-only">You are seen, safe, celebrated, supported, connected, welcome, and loved.</span>
    <span key={index} aria-hidden="true" className={`hpc-neon-word ${index === NEON_WORDS.length - 1 ? "hpc-neon-loved" : ""} ${!active ? "hpc-word-waiting" : ""}`} style={{ "--word-color": current.color, "--word-duration": `${WORD_DURATION_MS}ms` }}>{current.word}</span>
  </div>;
}

function PrideIntro({ onComplete }) {
  const skipRef = useRef(null);
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = overflow; };
  }, []);
  const content = <div className="hpc-intro" role="dialog" aria-modal="true" aria-label="Welcome to Hartford Pride Center" onKeyDown={(event) => { if (event.key === "Escape") onComplete(); if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); } }}>
    <div className="hpc-intro-inner">
      <p className="hpc-eyebrow">Every identity. One community.</p>
      <PrideFlags />
      <h1 className="hpc-intro-title">Hartford <span>Pride Center</span></h1>
      <p className="hpc-intro-powered">Powered by <strong>Karaoverse</strong></p>
      <div className="hpc-intro-affirmation"><span className="hpc-overline">Here, you are</span><NeonWords onComplete={onComplete} /></div>
      <button ref={skipRef} className="hpc-intro-skip" type="button" onClick={onComplete}>Skip intro <FaArrowRight aria-hidden="true" /></button>
      <div className="hpc-intro-progress" style={{ "--intro-duration": `${INTRO_DURATION_MS}ms` }} aria-hidden="true"><span /></div>
    </div>
  </div>;
  return typeof document === "undefined" ? content : createPortal(content, document.body);
}

function BelongingBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    if (!window.IntersectionObserver) { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} className="hpc-belonging hpc-belonging-note" aria-label="Everyone belongs here">
    <div className="hpc-belonging-copy">
      <span className="hpc-belonging-heart" aria-hidden="true"><FaHeart /></span>
      <p className="hpc-belonging-tagline">Not just a place. <em>A feeling.</em></p>
    </div>
    <div className="hpc-belonging-message">
      <h2>Here, you are</h2>
      <NeonWords key={replay} active={visible} />
      <p className="hpc-belonging-footnote">Exactly as you are.</p>
    </div>
    <button type="button" className="hpc-replay" onClick={() => { setVisible(true); setReplay((value) => value + 1); }} aria-label="Replay the belonging words" title="Replay words"><FaRedo aria-hidden="true" /><span>Replay</span></button>
  </section>;
}

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours ? `${hours}:` : ""}${hours ? String(minutes).padStart(2, "0") : minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function PrideTelevision({ channelIndex, onChannelChange }) {
  const videoRef = useRef(null);
  const televisionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const playIntent = useRef(!reducedMotion);
  const savedVolume = useRef(0.65);
  const savedMuted = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.65);
  const [volumeSupported, setVolumeSupported] = useState(true);
  const [waiting, setWaiting] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [retry, setRetry] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [standardControls, setStandardControls] = useState(false);
  const [playerNotice, setPlayerNotice] = useState("");
  const channel = PRIDE_CHANNELS[channelIndex];
  const channelNumber = String(channelIndex + 1).padStart(2, "0");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let cancelled = false;
    setCurrentTime(0); setDuration(0); setMediaError(false); setWaiting(true); setPlaying(false); setPlayerNotice("");
    video.muted = savedMuted.current;
    try {
      video.volume = savedVolume.current;
      setVolumeSupported(Math.abs(video.volume - savedVolume.current) < 0.01);
    } catch { setVolumeSupported(false); }
    setCanFullscreen(!!(televisionRef.current?.requestFullscreen || video.webkitEnterFullscreen));
    if (playIntent.current && !reducedMotion) {
      const attempt = video.play();
      attempt?.catch(() => { if (!cancelled) { setPlaying(false); setWaiting(false); } });
    } else setWaiting(false);
    return () => { cancelled = true; video.pause(); };
  }, [channel.id, retry, reducedMotion]);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === televisionRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      playIntent.current = true;
      try { await video.play(); setPlayerNotice(""); }
      catch { setWaiting(false); setPlayerNotice("Playback could not start. Try the standard video controls or another channel."); }
    } else { playIntent.current = false; video.pause(); }
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !(video.muted || video.volume === 0);
    if (!next && video.volume === 0) {
      try { video.volume = 0.5; savedVolume.current = video.volume; setVolume(video.volume); } catch { /* Device controls manage volume. */ }
    }
    video.muted = next; savedMuted.current = next; setMuted(next);
  };
  const changeVolume = (value) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Math.max(0, Math.min(1, Number(value)));
    try {
      video.volume = next;
      const supported = Math.abs(video.volume - next) < 0.01;
      setVolumeSupported(supported);
      if (supported) { savedVolume.current = next; setVolume(next); }
      video.muted = next === 0;
      savedMuted.current = video.muted; setMuted(video.muted);
    } catch { setVolumeSupported(false); }
  };
  const seek = (value) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(video.duration, Number(value)));
    setCurrentTime(video.currentTime);
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === televisionRef.current) await document.exitFullscreen();
      else if (televisionRef.current?.requestFullscreen) await televisionRef.current.requestFullscreen();
      else videoRef.current?.webkitEnterFullscreen?.();
    } catch { setPlayerNotice("Fullscreen is unavailable here. Try the standard video controls."); }
  };
  const changeChannel = (direction) => onChannelChange((channelIndex + direction + PRIDE_CHANNELS.length) % PRIDE_CHANNELS.length);

  return <div className="hpc-tv-area">
    <div className="hpc-tv-antenna" aria-hidden="true"><span /><span /></div>
    <div className="hpc-tv" ref={televisionRef}>
      <div className="hpc-tv-topline"><span className="hpc-tv-brand"><FaTv aria-hidden="true" /> PRIDE <b>TV</b></span><span className="hpc-tv-signal"><i className={playing ? "hpc-signal-active" : ""} />{playing ? "Now playing" : "On demand"}</span><span className="hpc-tv-model">Every color. Every story.</span></div>
      <div className="hpc-tv-body">
        <div className="hpc-screen-bezel"><div className="hpc-tv-screen">
          <video key={`${channel.id}-${retry}`} ref={videoRef} src={channel.src} poster={channel.poster} playsInline loop muted={muted} preload="metadata" controls={standardControls} aria-label={`${channel.category}: ${channel.title}`}
            onPlay={() => { setPlaying(true); playIntent.current = true; }}
            onPause={(event) => { setPlaying(false); if (event.currentTarget === videoRef.current) playIntent.current = false; }}
            onWaiting={() => setWaiting(true)}
            onPlaying={() => { setWaiting(false); setMediaError(false); }}
            onCanPlay={() => setWaiting(false)}
            onLoadedMetadata={(event) => { const value = event.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); setWaiting(false); }}
            onDurationChange={(event) => { const value = event.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); }}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onVolumeChange={(event) => { const video = event.currentTarget; savedMuted.current = video.muted; savedVolume.current = video.volume; setMuted(video.muted); setVolume(video.volume); }}
            onError={() => { setMediaError(true); setWaiting(false); setPlaying(false); }}>
            {channel.tracks?.map((track) => <track key={track.src} kind="captions" src={track.src} srcLang={track.srcLang} label={track.label} default={track.default} />)}
            Your browser does not support HTML video. <a href={channel.src}>Open the video</a>.
          </video>
          <span className="hpc-screen-channel" aria-hidden="true">CH {channelNumber}</span>
          {mediaError ? <div className="hpc-screen-message" role="status"><FaTv aria-hidden="true" /><strong>This channel couldn’t load.</strong><span>Try another channel or retry this video.</span><button type="button" onClick={() => setRetry((value) => value + 1)}><FaRedo aria-hidden="true" /> Retry video</button></div> : waiting ? <div className="hpc-screen-loading" role="status"><span className="hpc-buffer-dot" /> Tuning in…</div> : !playing && !standardControls ? <button type="button" className="hpc-screen-play" aria-label="Play video" onClick={togglePlay}><FaPlay aria-hidden="true" /></button> : null}
        </div></div>
        <div className="hpc-tv-hardware">
          <span className="hpc-hardware-label">Channel</span>
          <div className="hpc-channel-dial" aria-hidden="true"><span>{channelNumber}</span><i style={{ transform: `rotate(${channelIndex * 35 - 30}deg)` }} /></div>
          <div className="hpc-channel-buttons"><button type="button" onClick={() => changeChannel(-1)} disabled={PRIDE_CHANNELS.length < 2} aria-label="Previous channel" title="Previous channel"><FaChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => changeChannel(1)} disabled={PRIDE_CHANNELS.length < 2} aria-label="Next channel" title="Next channel"><FaChevronRight aria-hidden="true" /></button></div>
          <span className="hpc-hardware-label hpc-volume-label">Volume</span>
          <div className="hpc-volume-buttons"><button type="button" disabled={!volumeSupported} onClick={() => changeVolume(volume - 0.1)} aria-label="Volume down" title="Volume down"><FaMinus aria-hidden="true" /></button><button type="button" disabled={!volumeSupported} onClick={() => changeVolume(volume + 0.1)} aria-label="Volume up" title="Volume up"><FaPlus aria-hidden="true" /></button></div>
          <div className="hpc-speaker" aria-hidden="true" />
          <span className="hpc-hardware-footnote">Belong here.</span>
        </div>
      </div>
      <div className="hpc-tv-controls">
        <button type="button" className="hpc-tv-control" onClick={togglePlay} disabled={mediaError} aria-label={playing ? "Pause video" : "Play video"} title={playing ? "Pause" : "Play"}>{playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}</button>
        <div className="hpc-seek"><input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 1)} onChange={(event) => seek(event.target.value)} disabled={!duration || mediaError} aria-label="Video position" aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`} /><span>{formatTime(currentTime)} <span>/ {formatTime(duration)}</span></span></div>
        <div className="hpc-volume-control"><button type="button" className="hpc-tv-control" onClick={toggleMute} aria-label={muted || volume === 0 ? "Unmute video" : "Mute video"} title={muted || volume === 0 ? "Turn sound on" : "Mute"}>{muted || volume === 0 ? <FaVolumeMute aria-hidden="true" /> : <FaVolumeUp aria-hidden="true" />}</button><input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} disabled={!volumeSupported} onChange={(event) => changeVolume(event.target.value)} aria-label="Video volume" aria-valuetext={muted ? "Muted" : `${Math.round(volume * 100)} percent`} /></div>
        <button type="button" className="hpc-tv-control" onClick={toggleFullscreen} disabled={!canFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} title="Fullscreen">{fullscreen ? <FaCompress aria-hidden="true" /> : <FaExpand aria-hidden="true" />}</button>
      </div>
      <RainbowBar />
    </div>
    <div className="hpc-tv-feet" aria-hidden="true"><span /><span /></div>
    <div className="hpc-now-playing"><div><p className="hpc-eyebrow">Channel {channelNumber} <span> / </span> {channel.category}</p><h3 aria-live="polite">{channel.title}</h3><p>{channel.description}</p>{channel.href && <a className="hpc-inline-link" href={channel.href} target="_blank" rel="noopener noreferrer">{channel.linkLabel} <FaArrowRight aria-hidden="true" /></a>}</div><div className="hpc-player-options"><span>{muted || volume === 0 ? "Sound is off · tap the speaker" : "Sound is on"}</span>{!volumeSupported && <span>Adjust volume with your device buttons.</span>}<button type="button" aria-pressed={standardControls} onClick={() => setStandardControls((value) => !value)}>{standardControls ? "Hide standard controls" : "Standard video controls"}</button></div></div>
    {playerNotice && <p className="hpc-player-notice" role="status">{playerNotice}</p>}
    <div className="hpc-channel-list" role="group" aria-label="Choose a video channel">{PRIDE_CHANNELS.map((item, index) => <button key={item.id} type="button" aria-pressed={channelIndex === index} onClick={() => onChannelChange(index)} className={channelIndex === index ? "hpc-channel-selected" : ""}><span className="hpc-channel-number">{String(index + 1).padStart(2, "0")}</span><span><small>{item.category}</small><strong>{item.title}</strong></span><FaPlay aria-hidden="true" /></button>)}</div>
  </div>;
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [channelIndex, setChannelIndex] = useState(0);
  const headingRef = useRef(null);
  const televisionSectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();
  const completeIntro = useCallback(() => setShowIntro(false), []);
  useEffect(() => { if (!showIntro) headingRef.current?.focus({ preventScroll: true }); }, [showIntro]);
  const watchCollaboration = () => {
    setChannelIndex(PRIDE_CHANNELS.findIndex((channel) => channel.id === "karaoverse"));
    televisionSectionRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    televisionSectionRef.current?.focus({ preventScroll: true });
  };

  return <>
    <style>{HOME_STYLES}</style>
    {showIntro ? <PrideIntro onComplete={completeIntro} /> : <div className="hpc-home">
      <RainbowBar className="hpc-top-rainbow" />
      <main>
        <section className="hpc-hero hpc-container" aria-labelledby="hpc-hero-title">
          <div className="hpc-hero-copy">
            <h1 id="hpc-hero-title" ref={headingRef} tabIndex={-1}>Every <em>one</em><br />belongs <span className="hpc-here">here.</span></h1>
            <p className="hpc-hero-description">A place to be yourself.<br /><strong>A community to belong to.</strong></p>
            <p className="hpc-hero-body">Hartford Pride Center brings LGBTQIA+ visibility, safe spaces, advocacy, resources, and community partnerships together — across Hartford and the Capital Region, all year long.</p>
            <div className="hpc-hero-actions"><Link to="/pride" className="hpc-button hpc-button-primary">Capital City Pride 2026 <FaArrowRight aria-hidden="true" /></Link><a href="https://karaoverse.com/event/capital-city-pride" target="_blank" rel="noopener noreferrer" className="hpc-button hpc-button-outline"><FaCalendarAlt aria-hidden="true" /> Upcoming events</a></div>
            <Link to="/support" className="hpc-donate-link"><FaHandHoldingHeart aria-hidden="true" /> Help keep our community growing <span>Donate <FaArrowRight aria-hidden="true" /></span></Link>
          </div>
          <div className="hpc-hero-visual"><div className="hpc-logo-card"><div className="hpc-logo-card-heading"><span>With Pride. With love. With you.</span><FaHeart aria-hidden="true" /></div><div className="hpc-logo-frame"><img src="/PrideLogo3.jpg" alt="Hartford Pride Center" fetchPriority="high" /></div><RainbowBar /><p>Come as you are.<br /><em>We’re glad you’re here.</em></p></div><div className="hpc-board-flags"><PrideFlags /><span>Every identity. Every day.</span></div><div className="hpc-feature-pills"><Link to="/kalos-gala"><span className="hpc-pill-dot hpc-dot-green" /> Kalos Gala <FaArrowRight aria-hidden="true" /></Link><Link to="/driscoll-fund-application"><span className="hpc-pill-dot hpc-dot-orange" /> Driscoll Fund <FaArrowRight aria-hidden="true" /></Link></div></div>
        </section>

        <div className="hpc-container"><BelongingBanner /></div>

        <section className="hpc-container hpc-network-section" aria-labelledby="hpc-network-title">
          <a className="hpc-network-card" href="https://karaoverse.com/pride-network" target="_blank" rel="noopener noreferrer">
            <span className="hpc-network-icon" aria-hidden="true"><FaUsers /></span>
            <div className="hpc-network-copy">
              <h2 id="hpc-network-title">Proud Partner of the <em>Pride Network</em></h2>
              <p>Connected by community. United in Pride.</p>
            </div>
            <span className="hpc-network-cta">Explore the network <FaArrowRight aria-hidden="true" /><span className="hpc-sr-only"> (opens in a new tab)</span></span>
          </a>
        </section>

        <section className="hpc-container hpc-tv-section" ref={televisionSectionRef} tabIndex={-1} aria-labelledby="hpc-tv-title">
          <div className="hpc-section-heading"><div><p className="hpc-eyebrow">Pride TV · Community spotlight</p><h2 id="hpc-tv-title">Good people.<br className="hpc-mobile-break" /> <em>Great things happening.</em></h2></div><p>A little screen. A bigger connection.<br />Pick a channel and stay a while.</p></div>
          <PrideTelevision channelIndex={channelIndex} onChannelChange={setChannelIndex} />
        </section>

        <section className="hpc-explore-section" aria-labelledby="hpc-explore-title"><div className="hpc-container"><div className="hpc-section-heading"><div><p className="hpc-eyebrow">Pinned with Pride</p><h2 id="hpc-explore-title">Your community <em>noticeboard.</em></h2></div><p>Find support. Make connections.<br />There’s a place for you here.</p></div><nav className="hpc-explore-grid" aria-label="Explore the center">{EXPLORE_LINKS.map((item) => {
          const Icon = item.icon;
          const content = <><span className="hpc-explore-icon"><Icon aria-hidden="true" /></span><strong>{item.label}</strong><span>{item.detail}</span><FaArrowRight className="hpc-explore-arrow" aria-hidden="true" /></>;
          const props = { className: "hpc-explore-card", style: { "--card-color": item.color, "--card-wash": item.wash } };
          return item.href ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" {...props}>{content}</a> : <Link key={item.label} to={item.to} {...props}>{content}</Link>;
        })}</nav><Link to="/ourteam" className="hpc-team-link"><span className="hpc-team-icon"><FaUsers aria-hidden="true" /></span><span><strong>People make this place.</strong><small>Meet the team behind Hartford Pride Center.</small></span><span className="hpc-team-cta">Meet our team <FaArrowRight aria-hidden="true" /></span></Link></div></section>

        <section className="hpc-container hpc-about" aria-labelledby="hpc-about-title"><div className="hpc-about-photo"><img src="https://wp25.s3.amazonaws.com/wp-content/uploads/2025/01/29053539/Parade-Banner.webp" loading="lazy" alt="A community Pride celebration" /><div className="hpc-photo-caption"><span>Rooted in Greater Hartford.</span><strong>Open to every possibility.</strong></div></div><div className="hpc-about-copy"><p className="hpc-eyebrow">Empower · Educate · Celebrate</p><h2 id="hpc-about-title">More than a center.<br /><em>A sense of belonging.</em></h2><p>Building a future where every voice is heard, every identity celebrated, and every person empowered — across Hartford and the Capital Region.</p><div className="hpc-values"><article><span className="hpc-value-number">01</span><div><h3>Our mission</h3><p>To create a welcoming and affirming space for all members of the LGBTQIA+ community by fostering connection, promoting self-expression, and providing essential resources that empower individuals and strengthen our collective voice in Greater Hartford.</p></div></article><article><span className="hpc-value-number">02</span><div><h3>Our values</h3><p>We believe in authenticity, inclusivity, and collaboration. Through creativity and compassion, we build bridges across communities and celebrate the beauty of being unapologetically ourselves. Together, we thrive.</p></div></article></div></div></section>

        <section className="hpc-mission-band"><div className="hpc-container"><span className="hpc-mission-star" aria-hidden="true">✦</span><p className="hpc-eyebrow">This is what belonging looks like.</p><h2>A place where you feel seen, protected,<br /><em>celebrated, and connected.</em></h2><p>Through advocacy, education, outreach, and shared resources, we’re building a more inclusive future — where authenticity shines, partnerships grow stronger, and every voice matters.</p><Link to="/support" className="hpc-button hpc-button-light">Be part of something good <FaArrowRight aria-hidden="true" /></Link></div></section>

        <section className="hpc-container hpc-connect-section"><article className="hpc-collaboration"><span className="hpc-collab-icon"><FaTv aria-hidden="true" /></span><p className="hpc-eyebrow">Featured community collaboration</p><h2>Good things happen<br /><em>when we connect.</em></h2><p>Watch what we’re building with Karaoverse — and explore the possibilities of a more connected community.</p><div className="hpc-collab-actions"><button type="button" className="hpc-button hpc-button-primary" onClick={watchCollaboration}><FaPlay aria-hidden="true" /> Watch on Pride TV</button><a href="https://karaoverse.com" target="_blank" rel="noopener noreferrer" className="hpc-inline-link">Explore Karaoverse <FaArrowRight aria-hidden="true" /></a></div></article><section className="hpc-subscribe" aria-labelledby="hpc-subscribe-title"><span className="hpc-subscribe-icon"><FaEnvelope aria-hidden="true" /></span><p className="hpc-eyebrow">A little more community in your inbox</p><h2 id="hpc-subscribe-title">Stay <em>in the loop.</em></h2><p>Events, resources, and community news — straight to your inbox.</p><div className="hpc-subscribe-form"><EmailSubscribe prideId={2} /></div></section></section>
      </main>

      <footer className="hpc-footer"><div className="hpc-container"><div className="hpc-footer-grid"><div><p className="hpc-footer-name">Hartford<br /><em>Pride Center.</em></p><p className="hpc-footer-description">Year-round visibility, resources, volunteerism, wellness, advocacy, sponsorship, support services, and joyful LGBTQIA+ community building across Hartford and beyond.</p><RainbowBar className="hpc-footer-rainbow" /></div><nav aria-label="Footer navigation"><h2>Explore</h2><div className="hpc-footer-links">{[["Services", "/services"], ["Events", "/events"], ["Volunteer", "/volunteer"], ["Resources", "/resources"], ["Contact", "/contact"], ["Donate", "/support"], ["Sponsors", "/sponsors"], ["Our team", "/ourteam"]].map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div></nav><div className="hpc-footer-contact"><h2>Stay connected</h2><a className="hpc-email-link" href="mailto:david@hartfordpridecenter.org">david@hartfordpridecenter.org</a><p>Hartford, Connecticut</p><div className="hpc-socials"><a href="https://www.instagram.com/hartfordpride/" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride on Instagram"><FaInstagram aria-hidden="true" /></a><a href="https://www.facebook.com/HartfordPrideCenter" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride Center on Facebook"><FaFacebook aria-hidden="true" /></a><a href="mailto:david@hartfordpridecenter.org" aria-label="Email Hartford Pride Center"><FaEnvelope aria-hidden="true" /></a></div><button type="button" className="hpc-footer-replay" onClick={() => setShowIntro(true)}><FaRedo aria-hidden="true" /> Replay the welcome</button></div></div><div className="hpc-footer-bottom"><span>© {year} Hartford Pride Center · A program of CLARO Inc.</span><span>Built for advocacy, inclusion, and community joy.</span></div></div><RainbowBar /></footer>
    </div>}
  </>;
}

const HOME_STYLES = `
.hpc-home,.hpc-intro{--hpc-ink:#292239;--hpc-muted:#6b6474;--hpc-purple:#694782;--hpc-cream:#faf8f4;--hpc-line:#3025381c;--hpc-dark:#161121;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:15px;line-height:1.65;-webkit-font-smoothing:antialiased}
.hpc-home{background:var(--hpc-cream);color:var(--hpc-ink);min-width:0;isolation:isolate;color-scheme:light}
.hpc-home *,.hpc-intro *{box-sizing:border-box}
.hpc-home h1,.hpc-home h2,.hpc-home h3,.hpc-home p,.hpc-intro h1,.hpc-intro p{margin:0}
.hpc-home h1,.hpc-home h2,.hpc-home h3{color:inherit}
.hpc-home a{text-decoration:none}
.hpc-home button,.hpc-intro button{font:inherit;cursor:pointer}
.hpc-home button:disabled{cursor:not-allowed;opacity:.4}
.hpc-home a:focus-visible,.hpc-home button:focus-visible,.hpc-home input:focus-visible,.hpc-intro button:focus-visible{outline:3px solid #aa72d4;outline-offset:4px}
.hpc-home h1:focus,.hpc-tv-section:focus{outline:none}
.hpc-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.hpc-container{width:97%;max-width:1380px;padding-left:clamp(10px,2vw,32px);padding-right:clamp(10px,2vw,32px);margin-inline:auto}
.hpc-rainbow-bar{display:flex;height:4px;overflow:hidden;flex-shrink:0}.hpc-rainbow-bar>span{flex:1}.hpc-top-rainbow{height:5px}
.hpc-home em{font-family:Georgia,"Times New Roman",serif;font-weight:400}
.hpc-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.7px;text-transform:uppercase;color:var(--hpc-purple);line-height:1.5}
.hpc-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.8fr);align-items:center;gap:clamp(28px,5vw,90px);padding-top:calc(var(--hpc-header-offset,64px) + 48px);padding-bottom:56px}
.hpc-location{font-size:10px;letter-spacing:.7px;font-weight:650;color:#665770;display:flex;align-items:center;flex-wrap:wrap;gap:8px}.hpc-location>span{height:6px;width:6px;border-radius:50%;background:#91669d;box-shadow:0 0 0 4px #91669d12}.hpc-location i{font-style:normal;color:#aaa0ad}
.hpc-hero h1{font-size:clamp(44px,6.5vw,88px);line-height:1.04;letter-spacing:-4px;font-weight:650;margin:23px 0 24px}.hpc-hero h1 em{color:#8a5488}.hpc-here{position:relative;display:inline-block}.hpc-here::after{content:"";position:absolute;left:2px;right:0;bottom:-7px;height:5px;opacity:.65;border-radius:50%;background:linear-gradient(90deg,#dc7386,#e2ac72,#e9d885,#87b98f,#83a5d3,#ad85c1)}
.hpc-hero-description{font-size:clamp(17px,1.8vw,22px);line-height:1.6;color:#4e425d}.hpc-hero-description strong{font-weight:550}.hpc-hero-body{max-width:505px;font-size:13px;color:var(--hpc-muted);line-height:1.9;margin-top:17px!important}.hpc-hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:25px}
.hpc-button{display:inline-flex;justify-content:center;align-items:center;gap:11px;min-height:46px;border:1px solid transparent;border-radius:11px;padding:12px 18px;font-size:12px!important;font-weight:650!important;line-height:1.5;transition:transform .2s,background .2s,box-shadow .2s;text-align:center}.hpc-button:hover{transform:translateY(-2px);box-shadow:0 7px 18px #30223815}.hpc-button svg{font-size:12px;flex-shrink:0}.hpc-button-primary{color:#fff!important;background:#654578;border-color:#654578}.hpc-button-primary:hover{background:#513460}.hpc-button-outline{background:#fff8;border-color:#cfc4d5;color:#4e395e!important}.hpc-button-outline:hover{background:#fff}.hpc-button-light{background:#f3e8f6;color:#432e51!important;border-color:#f3e8f6}
.hpc-donate-link{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:#665c70;font-size:10px;margin-top:20px}.hpc-donate-link>svg{color:#866397;font-size:15px}.hpc-donate-link>span{display:flex;align-items:center;gap:6px;font-weight:750;color:#684578}.hpc-donate-link:hover>span{text-decoration:underline}
.hpc-hero-visual{width:100%;max-width:425px;justify-self:center}.hpc-logo-card{position:relative;padding:20px;background:linear-gradient(145deg,#eee5f3,#f8ece7);border:1px solid #dfd2e4;border-radius:28px;box-shadow:0 18px 60px #5035500d}.hpc-logo-card-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#786181;margin-bottom:17px}.hpc-logo-card-heading svg{color:#a97796}.hpc-logo-frame{background:white;overflow:hidden;border-radius:18px;border:1px solid #dfd3e3;padding:9px;aspect-ratio:1.12}.hpc-logo-frame img{display:block;width:100%;height:100%;object-fit:contain;border-radius:12px}.hpc-logo-card>.hpc-rainbow-bar{height:3px;border-radius:10px;margin:16px auto 14px;width:80px;opacity:.85}.hpc-logo-card>p{text-align:center;font-size:10px;color:#705c76;line-height:1.6}.hpc-logo-card>p em{font-size:21px;color:#543b62}.hpc-feature-pills{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.hpc-feature-pills a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:43px;padding:8px 10px;background:#fff;border:1px solid var(--hpc-line);border-radius:11px;color:#57425f;font-size:11px;font-weight:650;transition:border-color .2s}.hpc-feature-pills a:hover{border-color:#9671a9}.hpc-feature-pills a>svg{font-size:9px;margin-left:auto}.hpc-pill-dot{height:6px;width:6px;border-radius:50%;flex-shrink:0}.hpc-dot-green{background:#4e926d}.hpc-dot-orange{background:#c9894e}
.hpc-belonging{display:grid;grid-template-columns:1fr 1.35fr 40px;align-items:center;gap:15px;background:radial-gradient(ellipse at 76% 50%,#4d305233,transparent 65%),var(--hpc-dark);color:#f4eaf9;border:1px solid #493652;border-radius:20px;padding:21px 30px;position:relative;overflow:hidden}.hpc-belonging::after{content:"";position:absolute;height:2px;bottom:0;left:0;right:0;background:linear-gradient(90deg,#ff8993,#ffbb7a,#ffe680,#95e0ae,#9ac8ff,#c5a2ff);opacity:.55}.hpc-overline{font-size:8px;letter-spacing:1.6px;text-transform:uppercase;font-weight:600;color:#c6b1d5}.hpc-belonging h2{font-family:Georgia,serif;font-size:27px;font-weight:400;margin-top:4px}.hpc-neon-stage{display:flex;align-items:center;justify-content:center;min-width:0;min-height:88px;text-align:center}.hpc-neon-word{color:var(--word-color);font-size:clamp(38px,5vw,64px);font-weight:650;letter-spacing:-1.8px;line-height:1.2;text-shadow:0 0 14px color-mix(in srgb,var(--word-color) 25%,transparent);animation:hpc-word-fade var(--word-duration, 600ms) ease both}.hpc-neon-word.hpc-neon-loved{background:linear-gradient(100deg,#ff8993 0%,#ffbb7a 20%,#ffe680 38%,#95e0ae 55%,#9ac8ff 75%,#c5a2ff 100%);background-clip:text;-webkit-background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 14px #d9a9df22);animation:hpc-loved-in .7s ease both}.hpc-word-waiting{animation:none;opacity:1}.hpc-replay{display:grid;place-items:center;min-width:38px;height:38px;border:1px solid #ffffff25;border-radius:50%;background:#ffffff05;color:#dcc5ed;font-size:11px!important}.hpc-replay:hover{background:#ffffff14}
.hpc-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:30px}.hpc-section-heading h2,.hpc-about h2,.hpc-connect-section h2{font-size:clamp(29px,3.3vw,43px);line-height:1.15;letter-spacing:-1.4px;font-weight:550;margin-top:9px}.hpc-section-heading h2 em,.hpc-about h2 em,.hpc-connect-section h2 em{color:#87608d}.hpc-section-heading>p{font-size:11px;color:var(--hpc-muted);text-align:right;line-height:1.9;max-width:240px}.hpc-mobile-break{display:none}
.hpc-tv-section{padding-top:62px;padding-bottom:60px;scroll-margin-top:90px}.hpc-tv-area{max-width:1040px;margin:auto}.hpc-tv-antenna{display:flex;justify-content:center;height:35px;gap:36px;position:relative;z-index:0}.hpc-tv-antenna span{width:4px;height:49px;transform-origin:bottom;border-radius:4px;background:linear-gradient(90deg,#a998aa,#dcd2df,#7a677d);transform:rotate(-34deg)}.hpc-tv-antenna span+span{transform:rotate(34deg)}
.hpc-tv{position:relative;z-index:1;border:1px solid #765d73;border-radius:24px;background:linear-gradient(115deg,#4b3449,#36293a 55%,#574055);padding:17px 17px 0;box-shadow:0 20px 40px #3b24351c,inset 0 1px 1px #efddec55,inset 0 -1px 1px #0007;color:#eee3f0;overflow:hidden}.hpc-tv-topline{display:flex;align-items:center;gap:16px;padding:0 6px 14px;font-size:9px}.hpc-tv-brand{display:flex;align-items:center;gap:7px;letter-spacing:2px;font-size:12px;font-weight:600}.hpc-tv-brand b{font-weight:400;color:#d6b1d2}.hpc-tv-brand>svg{font-size:15px;color:#dabbc9}.hpc-tv-signal{display:flex;align-items:center;gap:6px;font-size:8px;color:#d5c5d7;letter-spacing:.8px;text-transform:uppercase}.hpc-tv-signal i{width:5px;height:5px;border-radius:50%;background:#b6a4b6}.hpc-tv-signal i.hpc-signal-active{background:#a5d0ac;box-shadow:0 0 6px #a5d0ac66}.hpc-tv-model{margin-left:auto;font-size:8px;color:#d2bbd1;font-style:italic}
.hpc-tv-body{display:grid;grid-template-columns:minmax(0,1fr) 96px;gap:15px;align-items:stretch}.hpc-screen-bezel{min-width:0;padding:7px;background:#201c24;border:1px solid #170f1b;border-radius:16px;box-shadow:0 1px 1px #f6e1f733,inset 0 3px 7px #0009}.hpc-tv-screen{position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:10px;background:#08070b;border:1px solid #ffffff0d}.hpc-tv-screen video{display:block;width:100%;height:100%;object-fit:contain;background:#08070b}.hpc-screen-channel{position:absolute;left:12px;top:12px;pointer-events:none;font-size:9px;letter-spacing:1px;color:#f2e5f3;background:#15111be6;border:1px solid #eee0f02a;border-radius:5px;padding:4px 7px;line-height:1.3}.hpc-screen-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;height:64px;display:grid;place-items:center;border-radius:50%;border:1px solid #eed6fa70;background:#281d36e6;color:#f0def7;font-size:18px!important;box-shadow:0 3px 24px #0005}.hpc-screen-play svg{margin-left:3px}.hpc-screen-play:hover{background:#5d4273}.hpc-screen-loading{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;align-items:center;background:#15111beb;border:1px solid #ffffff22;border-radius:30px;padding:7px 12px;white-space:nowrap;color:#f1e5f5;font-size:10px}.hpc-buffer-dot{width:6px;height:6px;background:#cba8e4;border-radius:50%;animation:hpc-buffer 1s ease-in-out infinite alternate}.hpc-screen-message{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:18px;gap:8px;text-align:center;background:#110d18;color:#f3e7fa}.hpc-screen-message>svg{font-size:24px;color:#cfb4e3}.hpc-screen-message strong{font-size:15px}.hpc-screen-message>span{font-size:11px;color:#d0bed9}.hpc-screen-message button{display:flex;align-items:center;gap:8px;border:1px solid #bda1cc;border-radius:8px;background:#3c2d49;color:#fff;font-size:11px;padding:7px 12px}
.hpc-tv-hardware{display:flex;align-items:center;flex-direction:column;padding:12px 4px 6px}.hpc-hardware-label{font-size:7px;letter-spacing:2px;text-transform:uppercase;color:#d9c6d7}.hpc-channel-dial{position:relative;display:grid;place-items:center;width:61px;height:61px;margin:12px 0;background:linear-gradient(130deg,#6a596c,#2d2231);border-radius:50%;border:2px solid #c4aec070;box-shadow:0 3px 8px #0006,inset 0 1px 3px #e9ddec35}.hpc-channel-dial>span{font-size:16px;font-weight:500;font-variant-numeric:tabular-nums;color:#f4e4f2}.hpc-channel-dial>i{position:absolute;width:3px;height:9px;background:#dec4df;left:calc(50% - 1.5px);top:5px;transform-origin:50% 23px;transition:transform .25s}.hpc-channel-buttons,.hpc-volume-buttons{display:flex;gap:5px}.hpc-channel-buttons button,.hpc-volume-buttons button{width:38px;min-height:39px;border:1px solid #ba9fb343;border-radius:9px;background:#241b2b99;color:#f1e4f2;display:grid;place-items:center;font-size:10px;box-shadow:0 2px 2px #0003}.hpc-channel-buttons button:hover,.hpc-volume-buttons button:hover{background:#6a4f74}.hpc-volume-label{margin:21px 0 10px}.hpc-speaker{width:62px;min-height:40px;flex:1;max-height:92px;margin:23px 0 10px;border-radius:7px;background:repeating-linear-gradient(0deg,#140e1980 0px,#140e1980 2px,transparent 2px,transparent 6px);opacity:.65}.hpc-hardware-footnote{font-family:Georgia,serif;font-style:italic;font-size:9px;color:#d8bcd1}
.hpc-tv-controls{display:flex;align-items:center;gap:10px;padding:11px 4px 13px}.hpc-tv-control{border:1px solid #e6cae126;background:#1e172280;border-radius:9px;display:grid;place-items:center;flex-shrink:0;width:40px;height:40px;color:#eeddF2;font-size:12px!important}.hpc-tv-control:hover{background:#765582}.hpc-seek{min-width:0;flex:1;display:flex;align-items:center;gap:10px}.hpc-tv input[type=range]{appearance:none;-webkit-appearance:none;height:22px;background:transparent;cursor:pointer;min-width:0;accent-color:#dab7e3;padding:0;margin:0;border:0;box-shadow:none}.hpc-tv input[type=range]::-webkit-slider-runnable-track{height:3px;border-radius:8px;background:#89768f}.hpc-tv input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:12px;height:12px;margin-top:-4.5px;border-radius:50%;background:#e9c9f0;border:1px solid #fae9ff;box-shadow:0 1px 4px #0004}.hpc-tv input[type=range]::-moz-range-track{height:3px;background:#89768f;border-radius:8px}.hpc-tv input[type=range]::-moz-range-thumb{width:11px;height:11px;background:#e9c9f0;border:1px solid #fae9ff;border-radius:50%}.hpc-tv input:disabled{opacity:.45;cursor:not-allowed}.hpc-seek>input{width:100%;flex:1}.hpc-seek>span{white-space:nowrap;font-size:9px;font-variant-numeric:tabular-nums;color:#f2e5f5}.hpc-seek>span>span{color:#c4afce}.hpc-volume-control{display:flex;align-items:center;gap:8px}.hpc-volume-control>input{width:64px}.hpc-tv>.hpc-rainbow-bar{margin-inline:-17px;opacity:.9;height:3px}.hpc-tv-feet{display:flex;justify-content:space-between;padding:0 13%;height:18px}.hpc-tv-feet>span{width:53px;height:18px;background:linear-gradient(0deg,#443248,#271b2c);transform:skewX(-18deg);border-radius:0 0 4px 4px}.hpc-tv-feet>span+span{transform:skewX(18deg)}
.hpc-now-playing{display:flex;justify-content:space-between;gap:25px;margin:21px 0 19px}.hpc-now-playing .hpc-eyebrow{font-size:8px;letter-spacing:1.2px}.hpc-now-playing .hpc-eyebrow>span{color:#ab93b5;padding-inline:5px}.hpc-now-playing h3{font-size:21px;letter-spacing:-.6px;font-weight:600;margin:5px 0}.hpc-now-playing p:not(.hpc-eyebrow){font-size:11px;color:var(--hpc-muted);max-width:600px}.hpc-player-options{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:5px;flex-shrink:0;font-size:9px;color:#77677f}.hpc-player-options>button{border:0;background:transparent;color:#715286;text-decoration:underline;text-underline-offset:3px;padding:4px 0;font-size:9px}.hpc-player-notice{padding:10px 13px;border:1px solid #d8c8df;border-radius:10px;font-size:11px;margin-bottom:13px!important;color:#5c456b;background:#f0e8f5}.hpc-inline-link{display:inline-flex;align-items:center;gap:9px;font-size:11px;color:#6c4b7f;font-weight:650}.hpc-inline-link:hover{text-decoration:underline;text-underline-offset:4px}.hpc-now-playing .hpc-inline-link{margin-top:8px}
.hpc-channel-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:10px}.hpc-channel-list>button{display:flex;align-items:center;gap:12px;text-align:left;background:#fff;border:1px solid #e0d5e3;border-radius:12px;padding:12px 14px;min-width:0;color:#51415e;transition:background .2s,border-color .2s}.hpc-channel-list>button.hpc-channel-selected{background:#eee5f5;border-color:#ac8dbc;box-shadow:inset 3px 0 #8c639e}.hpc-channel-list>button:hover{border-color:#89649e}.hpc-channel-number{width:36px;height:36px;border-radius:8px;display:grid;place-items:center;background:#f7f2fa;border:1px solid #ddd0e5;font-size:12px;font-variant-numeric:tabular-nums;flex-shrink:0}.hpc-channel-list>button>span:nth-child(2){min-width:0;flex:1}.hpc-channel-list small{display:block;font-size:8px;color:#786785;letter-spacing:.5px;margin-bottom:2px}.hpc-channel-list strong{display:block;font-size:11px;font-weight:650}.hpc-channel-list>button>svg{font-size:9px;flex-shrink:0;color:#89639e}
.hpc-tv:fullscreen{width:100vw;height:100vh;border:0;border-radius:0;display:flex;flex-direction:column;justify-content:center;background:#110d18;padding:16px}.hpc-tv:fullscreen .hpc-tv-body{display:flex;flex:1;min-height:0}.hpc-tv:fullscreen .hpc-tv-hardware{display:none}.hpc-tv:fullscreen .hpc-screen-bezel{width:100%;display:flex;border:0;padding:0}.hpc-tv:fullscreen .hpc-tv-screen{width:100%;height:100%;aspect-ratio:auto}.hpc-tv:fullscreen .hpc-tv-topline{flex-shrink:0}.hpc-tv:fullscreen .hpc-tv-controls{flex-shrink:0}
.hpc-explore-section{background:#f1ecef;border-top:1px solid #e4dae5;border-bottom:1px solid #e4dae5;padding:46px 0}.hpc-explore-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.hpc-explore-card{position:relative;display:flex;flex-direction:column;align-items:flex-start;min-width:0;background:var(--card-wash);color:var(--card-color);border:1px solid color-mix(in srgb,var(--card-color) 17%,transparent);border-radius:15px;padding:20px 16px 17px;transition:transform .2s,box-shadow .2s}.hpc-explore-card:hover{transform:translateY(-4px);box-shadow:0 10px 22px #2e21300b}.hpc-explore-icon{display:grid;place-items:center;width:36px;height:36px;border:1px solid color-mix(in srgb,var(--card-color) 17%,transparent);border-radius:10px;background:#ffffff88;font-size:15px;margin-bottom:16px}.hpc-explore-card>strong{font-size:15px;letter-spacing:-.3px;font-weight:700}.hpc-explore-card>span:not(.hpc-explore-icon){font-size:10px;line-height:1.7;margin-top:5px;max-width:135px}.hpc-explore-arrow{font-size:11px;margin-top:18px}.hpc-team-link{display:flex;align-items:center;gap:14px;margin-top:17px;padding:17px 20px;border:1px solid #ddcfE2;border-radius:14px;background:#fffc;color:#5c4369;transition:border-color .2s}.hpc-team-link:hover{border-color:#a680b7}.hpc-team-icon{width:39px;height:39px;border-radius:50%;display:grid;place-items:center;background:#ece1f2;color:#886095;flex-shrink:0}.hpc-team-link strong{display:block;font-size:13px;font-weight:650}.hpc-team-link small{display:block;font-size:10px;color:#827389;margin-top:2px}.hpc-team-cta{margin-left:auto;display:flex;align-items:center;gap:10px;font-size:11px;font-weight:650;white-space:nowrap}
.hpc-about{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:clamp(30px,5vw,76px);align-items:center;padding-top:65px;padding-bottom:65px}.hpc-about-photo{position:relative;width:100%;min-width:0;min-height:460px;height:100%;max-height:600px;border-radius:22px;overflow:hidden;background:#8f7e91}.hpc-about-photo>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 25%}.hpc-about-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 45%,#1a0e26c9)}.hpc-photo-caption{position:absolute;bottom:26px;left:25px;right:20px;z-index:1;color:#fff}.hpc-photo-caption>span{display:block;font-size:10px;letter-spacing:.4px}.hpc-photo-caption>strong{display:block;font-family:Georgia,serif;font-style:italic;font-size:25px;font-weight:400;margin-top:3px;line-height:1.25}.hpc-about-copy>p:not(.hpc-eyebrow){font-size:12px;color:var(--hpc-muted);line-height:1.9;margin-top:19px}.hpc-values{margin-top:25px}.hpc-values article{display:flex;align-items:flex-start;gap:15px;border-top:1px solid var(--hpc-line);padding-top:20px;margin-top:19px}.hpc-value-number{width:31px;height:31px;border-radius:50%;background:#eee5f2;color:#8d6898;display:grid;place-items:center;flex-shrink:0;font-size:10px}.hpc-values h3{font-size:15px;font-weight:600}.hpc-values p{margin-top:7px;font-size:11px;line-height:1.9;color:var(--hpc-muted)}
.hpc-mission-band{position:relative;padding:49px 0;text-align:center;background:radial-gradient(ellipse at 20% 100%,#71487555,transparent 60%),#302039;color:#f9eff9;border-block:1px solid #58425f}.hpc-mission-star{font-size:27px;color:#e1bade;display:block;margin-bottom:9px}.hpc-mission-band .hpc-eyebrow{color:#d0b2dc;font-size:8px}.hpc-mission-band h2{font-size:clamp(25px,3.4vw,43px);line-height:1.2;letter-spacing:-1px;font-weight:450;margin-top:14px}.hpc-mission-band h2 em{color:#eccbdd}.hpc-mission-band .hpc-container>p:not(.hpc-eyebrow){font-size:12px;line-height:1.9;max-width:640px;margin:18px auto 23px;color:#d6c1df}
.hpc-connect-section{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding-top:56px;padding-bottom:56px}.hpc-collaboration,.hpc-subscribe{padding:30px;border:1px solid #dfd1e6;border-radius:21px;min-width:0}.hpc-collaboration{background:#f0e9f4}.hpc-subscribe{background:linear-gradient(135deg,#fff,#faf0ed)}.hpc-collab-icon,.hpc-subscribe-icon{display:grid;place-items:center;width:42px;height:42px;border:1px solid #d6c2df;border-radius:12px;color:#8b679b;font-size:17px;background:#fff7;margin-bottom:23px}.hpc-connect-section .hpc-eyebrow{font-size:8px;letter-spacing:1.3px}.hpc-connect-section h2{font-size:33px;letter-spacing:-1.1px;margin-top:11px}.hpc-collaboration>p:not(.hpc-eyebrow),.hpc-subscribe>p:not(.hpc-eyebrow){font-size:11px;color:var(--hpc-muted);line-height:1.9;margin-top:16px}.hpc-collab-actions{display:flex;align-items:center;flex-wrap:wrap;gap:18px;margin-top:25px}.hpc-subscribe-form{margin-top:22px;min-width:0}.hpc-subscribe-form>div{max-width:100%}
.hpc-footer{background:#19131f;color:#edE0f2}.hpc-footer>.hpc-container{padding-top:45px;padding-bottom:20px}.hpc-footer-grid{display:grid;grid-template-columns:1.2fr .8fr 1fr;gap:clamp(24px,5vw,70px)}.hpc-footer-name{font-size:28px;line-height:1.15;letter-spacing:-.9px}.hpc-footer-name em{color:#d6b8df}.hpc-footer-description{font-size:11px;line-height:1.9;color:#b7a5c0;margin-top:17px!important;max-width:335px}.hpc-footer-rainbow{width:90px;margin-top:20px;height:3px;opacity:.8;border-radius:4px}.hpc-footer h2{font-size:9px;text-transform:uppercase;letter-spacing:1.8px;font-weight:650;color:#bca6c8;margin-bottom:18px}.hpc-footer-links{display:grid;grid-template-columns:1fr 1fr;gap:8px 18px}.hpc-footer-links a{color:#e9daef;font-size:11px}.hpc-footer a:hover{text-decoration:underline;text-underline-offset:4px}.hpc-footer-contact{min-width:0}.hpc-email-link{font-size:11px;overflow-wrap:anywhere;color:#eddef5}.hpc-footer-contact>p{font-size:10px;color:#b7a4c2;margin-top:9px}.hpc-socials{display:flex;gap:9px;margin-top:18px}.hpc-socials a{display:grid;place-items:center;width:38px;height:38px;border:1px solid #ae8fba50;border-radius:50%;background:#ffffff05;color:#dec3ed;font-size:15px}.hpc-socials a:hover{background:#765183}.hpc-footer-replay{display:flex;align-items:center;gap:7px;border:0;background:transparent;color:#c3a9d1;padding:0;margin-top:20px;font-size:9px!important}.hpc-footer-bottom{display:flex;justify-content:space-between;gap:13px;flex-wrap:wrap;font-size:9px;color:#af98bb;border-top:1px solid #bba4c52a;padding-top:18px;margin-top:32px}
.hpc-intro{position:fixed;inset:0;z-index:2147483000;overflow:auto;min-height:100dvh;background:radial-gradient(ellipse at 22% 25%,#b6668c25,transparent 50%),radial-gradient(ellipse at 80% 40%,#7060bd29,transparent 50%),#161121;color:#fff;display:grid;place-items:center;padding:28px 20px;color-scheme:dark}.hpc-intro-inner{text-align:center;width:100%;max-width:900px}.hpc-intro .hpc-eyebrow{color:#c9b0d9;font-size:9px;letter-spacing:2.3px}.hpc-pride-flags{display:flex;justify-content:center;gap:14px;margin:35px auto;max-width:680px}.hpc-pride-flag{display:flex;flex-direction:column;flex-shrink:0;width:62px;height:41px;border-radius:5px;overflow:hidden;border:1px solid #ffffff26;box-shadow:0 8px 24px #0004;animation:hpc-flag-in .65s both;animation-delay:var(--flag-delay)}.hpc-pride-flag>span{display:block;flex:1;min-height:0}.hpc-intro-title{font-size:clamp(32px,5.5vw,68px);letter-spacing:-2px;line-height:1.14;font-weight:500;color:#f9e3f3;text-shadow:0 0 18px #edb8d439}.hpc-intro-title>span{display:block;font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(90deg,#ff8993,#ffbb7a,#ffe680,#95e0ae,#9ac8ff,#c5a2ff);background-clip:text;-webkit-background-clip:text;color:transparent;text-shadow:none}.hpc-intro-powered{font-size:10px;letter-spacing:1.1px;color:#cab5d5;margin-top:16px!important}.hpc-intro-powered strong{color:#f2e1f9;font-weight:550}.hpc-intro-affirmation{margin:25px auto 17px}.hpc-intro-affirmation>.hpc-overline{font-size:8px}.hpc-intro .hpc-neon-stage{min-height:91px}.hpc-intro .hpc-neon-word{font-size:clamp(35px,6vw,62px)}.hpc-intro-skip{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #cfabd750;background:#ffffff07;color:#ecdcf7;font-size:10px!important;min-height:36px;padding:7px 15px;border-radius:30px;transition:background .2s}.hpc-intro-skip>svg{font-size:9px}.hpc-intro-skip:hover{background:#ffffff15}.hpc-intro-progress{width:90px;height:2px;border-radius:10px;overflow:hidden;background:#ffffff14;margin:25px auto 0}.hpc-intro-progress>span{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,#ff8993,#ffbb7a,#ffe680,#95e0ae,#9ac8ff,#c5a2ff);animation:hpc-intro-progress var(--intro-duration, 4700ms) linear both}
@keyframes hpc-word-fade{0%{opacity:0;transform:translateY(5px)}20%,77%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-4px)}}
@keyframes hpc-loved-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes hpc-flag-in{from{opacity:0;transform:translateY(15px) rotate(0)}to{opacity:1;transform:translateY(0) rotate(var(--flag-rotation))}}
@keyframes hpc-buffer{from{opacity:.4}to{opacity:1}}
@keyframes hpc-intro-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(min-width:1600px){.hpc-container{max-width:1560px}.hpc-hero{grid-template-columns:1.3fr .8fr}.hpc-hero-visual{max-width:450px}.hpc-hero h1{font-size:98px}.hpc-tv-area{max-width:1150px}.hpc-hero-body{font-size:15px;max-width:610px}.hpc-section-heading>p,.hpc-now-playing p:not(.hpc-eyebrow){font-size:13px}.hpc-about-copy>p:not(.hpc-eyebrow),.hpc-values p{font-size:13px}}
@media(max-width:1050px){.hpc-hero{gap:30px}.hpc-hero h1{font-size:65px;letter-spacing:-3px}.hpc-hero-body{font-size:12px}.hpc-explore-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.hpc-explore-card{padding:17px}.hpc-explore-icon{margin-bottom:12px}.hpc-explore-arrow{position:absolute;right:17px;top:20px;margin:0}.hpc-explore-card>span:not(.hpc-explore-icon){max-width:none}.hpc-about{gap:30px}.hpc-connect-section{gap:16px}.hpc-collaboration,.hpc-subscribe{padding:24px}.hpc-footer-grid{grid-template-columns:1fr .8fr 1fr;gap:30px}.hpc-channel-dial{width:56px;height:56px}.hpc-tv-hardware{padding-top:5px}.hpc-volume-label{margin-top:13px}.hpc-speaker{margin-top:15px}}
@media(max-width:760px){.hpc-container{width:97%;padding-inline:12px}.hpc-hero{grid-template-columns:1fr;gap:28px;padding-top:calc(var(--hpc-header-offset,64px) + 26px);padding-bottom:30px}.hpc-hero h1{font-size:clamp(48px,10vw,75px);margin:19px 0 22px;letter-spacing:-2.8px}.hpc-hero-description{font-size:18px}.hpc-hero-body{max-width:590px;font-size:12px}.hpc-hero-actions{margin-top:21px}.hpc-hero-visual{max-width:420px;width:90%}.hpc-logo-card{padding:17px;border-radius:22px}.hpc-logo-frame{aspect-ratio:1.4}.hpc-logo-card-heading{font-size:8px;margin-bottom:12px}.hpc-feature-pills{margin-top:9px}.hpc-belonging{grid-template-columns:1fr 1.2fr 34px;padding:22px 18px;gap:8px;border-radius:15px}.hpc-belonging h2{font-size:23px}.hpc-belonging .hpc-overline{font-size:7px;letter-spacing:1px}.hpc-belonging .hpc-neon-word{font-size:34px;letter-spacing:-1px}.hpc-belonging .hpc-neon-stage{min-height:65px}.hpc-replay{min-width:32px;height:32px;font-size:10px!important}.hpc-section-heading{align-items:flex-start;gap:16px;margin-bottom:23px}.hpc-section-heading h2,.hpc-about h2{font-size:31px;letter-spacing:-1px}.hpc-section-heading>p{font-size:10px;max-width:175px}.hpc-tv-section{padding-top:38px;padding-bottom:37px}.hpc-tv-body{grid-template-columns:minmax(0,1fr) 73px;gap:10px}.hpc-tv{padding:12px 12px 0;border-radius:19px}.hpc-tv>.hpc-rainbow-bar{margin-inline:-12px}.hpc-tv-topline{padding:0 2px 11px;gap:12px}.hpc-tv-brand{font-size:10px}.hpc-tv-model{font-size:7px}.hpc-tv-hardware{padding:4px 0}.hpc-channel-dial{width:46px;height:46px;margin:8px 0}.hpc-channel-dial>i{height:6px;top:4px;transform-origin:50% 18px}.hpc-channel-dial>span{font-size:12px}.hpc-channel-buttons,.hpc-volume-buttons{gap:4px}.hpc-channel-buttons button,.hpc-volume-buttons button{width:33px;min-height:34px;border-radius:7px;font-size:9px}.hpc-hardware-label{font-size:6px;letter-spacing:1.5px}.hpc-volume-label{margin:13px 0 7px}.hpc-speaker{width:50px;min-height:15px;margin:15px 0 5px;max-height:40px}.hpc-hardware-footnote{display:none}.hpc-tv-controls{gap:8px;padding:9px 0 11px}.hpc-tv-control{width:36px;height:36px;font-size:10px!important}.hpc-volume-control>input{width:47px}.hpc-seek{gap:7px}.hpc-seek>span{font-size:8px}.hpc-now-playing{gap:15px;margin-top:17px}.hpc-now-playing h3{font-size:19px}.hpc-player-options{font-size:8px;max-width:150px}.hpc-player-options>button{font-size:8px}.hpc-explore-section{padding:32px 0}.hpc-team-link{padding:14px}.hpc-about{grid-template-columns:1fr;padding-top:38px;padding-bottom:38px;gap:26px}.hpc-about-photo{min-height:300px;aspect-ratio:1.8;max-height:360px}.hpc-about-copy>p:not(.hpc-eyebrow){font-size:12px}.hpc-values p{font-size:12px}.hpc-mission-band{padding:34px 0}.hpc-mission-band h2{font-size:31px}.hpc-connect-section{padding-top:36px;padding-bottom:36px;grid-template-columns:1fr}.hpc-connect-section h2{font-size:32px}.hpc-collab-icon,.hpc-subscribe-icon{margin-bottom:17px}.hpc-footer-grid{grid-template-columns:1fr 1fr;gap:32px}.hpc-footer-grid>div:first-child{grid-column:1/-1;display:grid;grid-template-columns:1fr 1.4fr;gap:12px 30px}.hpc-footer-description{margin:0!important;max-width:none}.hpc-footer-rainbow{margin-top:0}.hpc-footer>.hpc-container{padding-top:32px}.hpc-pride-flags{gap:11px}.hpc-pride-flag{width:49px;height:33px}}
@media(max-width:520px){.hpc-container{padding-inline:8px}.hpc-location{font-size:8px;gap:6px;letter-spacing:.3px}.hpc-hero h1{font-size:clamp(43px,12vw,61px)}.hpc-hero-description{font-size:17px}.hpc-hero-body{font-size:11px;line-height:1.85}.hpc-hero-actions{gap:8px}.hpc-hero-actions .hpc-button{flex:1;min-height:46px;font-size:10px!important;padding:10px 10px;gap:7px}.hpc-hero-actions .hpc-button svg{font-size:10px}.hpc-donate-link{font-size:9px;gap:6px;margin-top:15px}.hpc-hero-visual{width:94%;max-width:345px}.hpc-logo-frame{aspect-ratio:1.45}.hpc-logo-card{padding:14px}.hpc-logo-card>p em{font-size:19px}.hpc-logo-card>p{font-size:9px}.hpc-feature-pills a{font-size:10px;min-height:40px}.hpc-belonging{grid-template-columns:1fr 30px;padding:17px 16px 20px;gap:0}.hpc-belonging-copy{grid-column:1;display:flex;align-items:center;justify-content:space-between;gap:10px}.hpc-belonging .hpc-overline{font-size:6px;letter-spacing:.8px;max-width:110px}.hpc-belonging h2{font-size:19px;margin:0;white-space:nowrap}.hpc-belonging>.hpc-neon-stage{grid-row:2;grid-column:1/-1;min-height:76px;margin-top:7px}.hpc-belonging .hpc-neon-word{font-size:42px;letter-spacing:-1.5px}.hpc-replay{grid-row:1;grid-column:2;min-width:28px;height:28px;margin-left:8px;font-size:8px!important}.hpc-section-heading{display:block;margin-bottom:18px}.hpc-section-heading h2{font-size:29px}.hpc-section-heading>p{text-align:left;max-width:none;margin-top:10px;font-size:10px}.hpc-section-heading>p br{display:none}.hpc-eyebrow{font-size:8px;letter-spacing:1.2px}.hpc-mobile-break{display:block}.hpc-tv-antenna{height:24px;gap:29px}.hpc-tv-antenna>span{height:35px;width:3px}.hpc-tv{padding:10px 9px 0;border-radius:16px}.hpc-tv>.hpc-rainbow-bar{margin-inline:-9px}.hpc-tv-topline{gap:10px;padding-bottom:9px}.hpc-tv-brand{font-size:9px;letter-spacing:1.4px;gap:5px}.hpc-tv-brand>svg{font-size:12px}.hpc-tv-signal{margin-left:auto;font-size:6px;letter-spacing:.6px}.hpc-tv-model{display:none}.hpc-tv-body{display:flex;flex-direction:column;gap:9px}.hpc-screen-bezel{padding:4px;border-radius:11px}.hpc-tv-screen{border-radius:7px}.hpc-screen-channel{font-size:7px;top:8px;left:8px;padding:3px 5px}.hpc-screen-play{width:45px;height:45px;font-size:14px!important}.hpc-screen-loading{font-size:8px;bottom:10px;padding:5px 9px}.hpc-screen-message{padding:12px;gap:6px}.hpc-screen-message>svg{font-size:20px}.hpc-screen-message strong{font-size:12px}.hpc-screen-message>span{font-size:9px}.hpc-screen-message button{font-size:9px;min-height:32px}.hpc-tv-hardware{display:flex;flex-direction:row;align-items:center;gap:8px;padding:0 2px}.hpc-channel-dial{width:30px;height:30px;margin:0;border-width:1px;order:-1}.hpc-channel-dial>span{font-size:10px}.hpc-channel-dial>i{display:none}.hpc-channel-buttons button,.hpc-volume-buttons button{width:35px;min-height:36px;font-size:9px}.hpc-channel-buttons{gap:5px}.hpc-volume-label{margin:0 0 0 auto}.hpc-hardware-label{font-size:6px;letter-spacing:.6px}.hpc-speaker{display:none}.hpc-tv-controls{gap:6px;padding:8px 1px 10px}.hpc-tv-control{width:32px;height:35px;border-radius:7px}.hpc-seek{gap:2px;flex-direction:column;align-items:stretch}.hpc-seek>input{width:100%;flex:auto;height:16px!important}.hpc-seek>span{font-size:7px;line-height:1.2;text-align:right}.hpc-volume-control{gap:5px}.hpc-volume-control>input{width:36px}.hpc-tv-feet{height:13px}.hpc-tv-feet>span{height:13px;width:35px}.hpc-now-playing{display:block;margin:17px 0 14px}.hpc-now-playing h3{font-size:18px}.hpc-now-playing .hpc-eyebrow{font-size:7px;letter-spacing:.7px}.hpc-now-playing p:not(.hpc-eyebrow){font-size:10px}.hpc-player-options{max-width:none;align-items:flex-start;flex-direction:row;flex-wrap:wrap;gap:5px 12px;margin-top:8px;font-size:8px}.hpc-player-options>button{padding:0}.hpc-channel-list{gap:8px;grid-template-columns:1fr}.hpc-channel-list>button{padding:10px 12px}.hpc-channel-number{width:30px;height:32px;font-size:10px}.hpc-channel-list strong{font-size:10px}.hpc-channel-list small{font-size:7px}.hpc-explore-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.hpc-explore-card{padding:15px 13px;border-radius:12px}.hpc-explore-icon{width:32px;height:32px;font-size:13px;margin-bottom:13px}.hpc-explore-card>strong{font-size:14px}.hpc-explore-card>span:not(.hpc-explore-icon){font-size:9px}.hpc-explore-arrow{right:14px;top:20px;font-size:9px}.hpc-team-link{gap:10px;padding:13px 11px;flex-wrap:wrap}.hpc-team-icon{width:32px;height:32px;font-size:13px}.hpc-team-link strong{font-size:11px}.hpc-team-link small{font-size:9px}.hpc-team-cta{width:100%;padding-left:42px;font-size:10px;justify-content:space-between}.hpc-about-photo{min-height:240px;aspect-ratio:1.35;border-radius:17px}.hpc-photo-caption{left:20px;bottom:20px}.hpc-photo-caption>strong{font-size:23px}.hpc-about h2{font-size:29px}.hpc-about-copy>p:not(.hpc-eyebrow){font-size:11px}.hpc-values p{font-size:10px;line-height:1.9}.hpc-values article{gap:11px;margin-top:16px;padding-top:17px}.hpc-values h3{font-size:14px}.hpc-mission-band h2{font-size:28px}.hpc-mission-band h2 br{display:none}.hpc-mission-band .hpc-container>p:not(.hpc-eyebrow){font-size:11px}.hpc-collaboration,.hpc-subscribe{padding:22px 18px;border-radius:17px}.hpc-connect-section h2{font-size:30px}.hpc-collaboration>p:not(.hpc-eyebrow),.hpc-subscribe>p:not(.hpc-eyebrow){font-size:10px}.hpc-collab-actions{gap:15px}.hpc-collab-actions .hpc-button{font-size:10px!important}.hpc-inline-link{font-size:10px}.hpc-footer-grid{gap:27px 20px}.hpc-footer-grid>div:first-child{display:block}.hpc-footer-name{font-size:27px}.hpc-footer-description{font-size:10px;max-width:340px;margin-top:14px!important}.hpc-footer-rainbow{margin-top:16px}.hpc-footer h2{font-size:8px;letter-spacing:1.2px;margin-bottom:14px}.hpc-footer-links{gap:8px 10px}.hpc-footer-links a{font-size:10px}.hpc-email-link{font-size:9px}.hpc-footer-contact>p{font-size:9px}.hpc-socials{gap:7px}.hpc-socials a{width:33px;height:33px;font-size:13px}.hpc-footer-bottom{font-size:8px;gap:5px}.hpc-footer-replay{font-size:8px!important}.hpc-pride-flags{display:grid;grid-template-columns:repeat(4,1fr);max-width:270px;gap:15px 13px;margin:28px auto}.hpc-pride-flag{width:100%;height:35px}.hpc-intro-title{font-size:43px;letter-spacing:-1.5px}.hpc-intro .hpc-eyebrow{font-size:7px;letter-spacing:1.8px}.hpc-intro-affirmation{margin:20px auto 15px}.hpc-intro .hpc-neon-stage{min-height:78px}.hpc-intro .hpc-neon-word{font-size:42px}.hpc-intro-powered{font-size:9px}}
@media(max-width:350px){.hpc-tv-hardware{gap:5px}.hpc-hardware-label{font-size:5px;letter-spacing:.4px}.hpc-channel-buttons button,.hpc-volume-buttons button{width:31px}.hpc-volume-control>input{width:26px}.hpc-footer-grid{grid-template-columns:1fr}.hpc-footer-grid>div:first-child{grid-column:auto}.hpc-footer-contact{padding-top:4px}.hpc-team-link small{font-size:8px}.hpc-hero-actions{flex-direction:column}.hpc-intro-title{font-size:37px}.hpc-belonging .hpc-neon-word{font-size:38px}}

/* Pride community board: paper textures, colorful notices, and a rainbow TV. */
.hpc-home{--hpc-muted:#5f526b;--hpc-purple:#71378b;--hpc-line:#7555842b;background:radial-gradient(ellipse at 0 0,#ffdce76b,transparent 35%),radial-gradient(ellipse at 100% 22%,#cbdfff70,transparent 32%),radial-gradient(ellipse at 0 65%,#d5f0df70,transparent 30%),#fffaf5}
.hpc-top-rainbow{height:7px}
.hpc-community-label{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:7px 12px;margin-bottom:17px;border:1px solid #dab7da;border-radius:999px;background:linear-gradient(110deg,#ffe0ea,#fff3d4 40%,#e2f4e8 68%,#eae0ff);color:#563068;font-size:10px;font-weight:800;letter-spacing:.65px;text-transform:uppercase}
.hpc-community-label svg{color:#b82c6c;flex-shrink:0}
.hpc-hero{gap:clamp(25px,4vw,65px)}
.hpc-hero h1 em{color:#a12c73}.hpc-hero h1 .hpc-here{color:#58317c}
.hpc-here::after{height:6px;opacity:1;border-radius:6px;background:linear-gradient(90deg,#d84668,#dd8939,#d9b63d,#35976c,#487dc5,#9460b9)}
.hpc-button-primary{background:linear-gradient(115deg,#963268,#653698 70%,#414c98);border-color:#703781;box-shadow:0 4px 12px #85408920}
.hpc-button-primary:hover{background:linear-gradient(115deg,#7d2357,#532a80 70%,#343e81)}
.hpc-button-outline{background:linear-gradient(120deg,#fff5df,#eff6ff);border-color:#b3c5dd;color:#304f7b!important}
.hpc-hero-visual{padding-top:13px}
.hpc-logo-card{background:linear-gradient(135deg,#ffe1eb,#fff2d5 38%,#e4f5ec 67%,#e7e1ff);border:1px solid #dfbfce;border-radius:14px;box-shadow:0 16px 36px #51335818,3px 4px 0 #f9f0e7,4px 5px 0 #d9c9d6;transform:rotate(1deg)}
.hpc-logo-card::before,.hpc-collaboration::before,.hpc-subscribe::before{content:"";position:absolute;z-index:2;pointer-events:none;top:-10px;left:calc(50% - 38px);width:76px;height:23px;border:1px solid #fff9;background:repeating-linear-gradient(90deg,#f1a4beaa 0 12px,#f6d18eaa 12px 24px,#c3e3c8bb 24px 36px,#b4d4eeaa 36px 48px,#d3b5ebaa 48px 60px);transform:rotate(-5deg);box-shadow:0 2px 4px #76547512}
.hpc-logo-card-heading{color:#603968;font-weight:750}.hpc-logo-card-heading svg{color:#b92e6b}
.hpc-logo-card>.hpc-rainbow-bar{width:48%;height:4px}.hpc-logo-card>p{color:#654360}
.hpc-board-flags{text-align:center;margin-top:18px}.hpc-board-flags .hpc-pride-flags{display:flex;flex-wrap:wrap;gap:8px;margin:0 auto 8px;max-width:100%;padding:5px}
.hpc-board-flags .hpc-pride-flag{width:31px;height:21px;border-radius:3px;border-color:#3c244329;box-shadow:0 3px 7px #4b2e4319;animation:none;transform:rotate(var(--flag-rotation))}
.hpc-board-flags>span{font-size:9px;letter-spacing:1.4px;text-transform:uppercase;color:#6a466b;font-weight:750}
.hpc-feature-pills a:first-child{background:#e0f3e9;border-color:#a9d2bc;color:#245e43}.hpc-feature-pills a:last-child{background:#fff0d8;border-color:#e4c492;color:#785123}
.hpc-belonging{background:radial-gradient(ellipse at 0 0,#8c2d6c65,transparent 50%),radial-gradient(ellipse at 100% 100%,#1b636b65,transparent 50%),#21142e;border-color:#81528a;box-shadow:0 9px 26px #57305b13}
.hpc-belonging::after{height:4px;opacity:1}
.hpc-section-heading h2 em,.hpc-about h2 em,.hpc-connect-section h2 em{color:#8c387c}
.hpc-tv-section .hpc-section-heading{border-bottom:1px solid #d8c2da;padding-bottom:20px}
.hpc-tv{border:2px solid #fff9;background:linear-gradient(115deg,#c64c76 0%,#d78a59 19%,#d3b565 35%,#5ea78b 53%,#5e8dba 72%,#996db6 100%);box-shadow:0 22px 42px #56396b26,inset 0 2px 2px #fff9,inset 0 -2px 4px #37213c66}
.hpc-tv-topline{background:#241a36ed;border:1px solid #ffffff40;border-radius:10px;margin-bottom:12px;padding:10px 12px;color:#fff}
.hpc-tv-brand b{color:#ffcced}.hpc-tv-brand>svg{color:#ffda91}.hpc-tv-signal,.hpc-tv-model{color:#f1e5f5}
.hpc-tv-hardware{background:#261c37f0;border:1px solid #fff5;border-radius:13px;padding-inline:5px}
.hpc-hardware-label,.hpc-hardware-footnote{color:#f3e1fb}
.hpc-channel-dial{border:3px solid transparent;background:linear-gradient(135deg,#463254,#20172d) padding-box,conic-gradient(#f784a4,#f0ca79,#80d3ab,#87b6ef,#c89be7,#f784a4) border-box}
.hpc-channel-buttons button,.hpc-volume-buttons button{background:#49335e;border-color:#b895cc75;color:#fff}
.hpc-channel-buttons button:hover,.hpc-volume-buttons button:hover{background:#705189}
.hpc-tv-controls{background:#261c37f5;border:1px solid #ffffff40;border-radius:11px;margin:10px 0;padding:8px}
.hpc-tv-control{background:#453158;border-color:#ba9bc67a;color:#fff}
.hpc-tv input[type=range]::-webkit-slider-runnable-track{background:linear-gradient(90deg,#ed91ac,#e9c980,#8bcfaf,#8fb3e7,#c29bdc);height:4px}
.hpc-tv input[type=range]::-moz-range-track{background:linear-gradient(90deg,#ed91ac,#e9c980,#8bcfaf,#8fb3e7,#c29bdc);height:4px}
.hpc-tv input[type=range]::-webkit-slider-thumb{background:#fff;border-color:#fff}.hpc-tv input[type=range]::-moz-range-thumb{background:#fff;border-color:#fff}
.hpc-tv>.hpc-rainbow-bar{height:5px;opacity:1}.hpc-tv-antenna span{background:linear-gradient(90deg,#aa669b,#edcee1,#69508f)}
.hpc-now-playing{padding:15px;border:1px solid #dec9df;border-left:4px solid #a95aab;border-radius:4px 12px 12px 4px;background:#fffafded}
.hpc-channel-list>button:nth-child(odd){background:#fff0f4;border-color:#dfb3c6}.hpc-channel-list>button:nth-child(even){background:#edf6ff;border-color:#b8cce7}
.hpc-channel-list>button.hpc-channel-selected{background:linear-gradient(105deg,#f9deef,#e6e5ff);border-color:#8952a2;box-shadow:inset 4px 0 #8952a2}
.hpc-explore-section{position:relative;background:radial-gradient(#99744e1c .8px,transparent .8px) 0 0/5px 5px,linear-gradient(120deg,#efdfce,#f6e9d9 45%,#eadedb);border-block:7px solid #dac1ac;box-shadow:inset 0 2px 6px #77533418,inset 0 -2px 6px #77533418;padding-block:38px}
.hpc-explore-section .hpc-section-heading{padding-bottom:16px;border-bottom:1px dashed #b8a08f}
.hpc-explore-grid{gap:18px;padding-top:12px;padding-bottom:8px}
.hpc-explore-card{border-radius:4px 4px 15px 4px;border-color:color-mix(in srgb,var(--card-color) 27%,white);border-top:5px solid var(--card-color);padding-top:25px;box-shadow:2px 5px 0 #6e503814,0 9px 18px #63423510;transform:rotate(-1deg)}
.hpc-explore-card:nth-child(even){transform:rotate(1deg)}
.hpc-explore-card::before{content:"";position:absolute;top:-11px;left:calc(50% - 5px);height:11px;width:11px;border-radius:50%;background:radial-gradient(circle at 32% 25%,#fff 0 12%,var(--card-color) 40%);border:1px solid #fff8;box-shadow:1px 3px 3px #40233340}
.hpc-explore-card:hover,.hpc-explore-card:focus-visible{transform:translateY(-4px) rotate(0);box-shadow:0 12px 20px #63423522}
.hpc-explore-card>strong{font-size:17px}.hpc-explore-card>span:not(.hpc-explore-icon){font-size:11px}
.hpc-explore-icon{background:#fffc}.hpc-team-link{background:linear-gradient(115deg,#fff5fa,#edf5ff);border-color:#c5b3d9;box-shadow:0 4px 12px #71547110}.hpc-team-link small{color:#655171}
.hpc-about-photo{border:7px solid #fff;box-shadow:0 12px 28px #49314b20;transform:rotate(-.7deg);border-radius:8px}
.hpc-values article{padding:17px;border:1px solid #c0dccc;background:#edf7ef;border-radius:12px}.hpc-values article+article{border-color:#d1c0e5;background:#f1eafa}.hpc-values article:first-child .hpc-value-number{background:#cbe8d5;color:#275d40}.hpc-values article+article .hpc-value-number{background:#e3d2f3;color:#60397e}
.hpc-mission-band{background:radial-gradient(ellipse at 0 100%,#98406866,transparent 55%),radial-gradient(ellipse at 100% 0,#2b777766,transparent 55%),#2b1d3b;border-block:4px solid transparent;border-image:linear-gradient(90deg,#d35b7d,#d4a356,#65a888,#598cb7,#9864b0) 1}
.hpc-mission-band h2 em{color:#f1d5e8}.hpc-mission-star{color:#ffd98d}
.hpc-collaboration,.hpc-subscribe{position:relative;border-radius:6px 6px 20px 6px;box-shadow:0 9px 22px #61416912}
.hpc-collaboration{background:linear-gradient(140deg,#f5e3ff,#e6efff);border-color:#ccb0e4}.hpc-subscribe{background:linear-gradient(135deg,#ffefd9,#ffe5ed);border-color:#e8bfbb}
.hpc-collab-icon{color:#734398;background:#fdf6ff}.hpc-subscribe-icon{color:#9c3d64;background:#fff7ee;border-color:#e7b8c6}
.hpc-footer{background:radial-gradient(ellipse at 0 0,#70315355,transparent 60%),radial-gradient(ellipse at 100% 100%,#22596b55,transparent 60%),#20172b}
.hpc-socials a:nth-child(1){background:#6e3254;color:#ffebf6}.hpc-socials a:nth-child(2){background:#314f77;color:#e9f3ff}.hpc-socials a:nth-child(3){background:#3c6458;color:#eafff4}
.hpc-footer-rainbow{width:135px;height:4px;opacity:1}
.hpc-intro{background:radial-gradient(ellipse at 0 0,#b93d6d40,transparent 45%),radial-gradient(ellipse at 100% 15%,#dca34120,transparent 40%),radial-gradient(ellipse at 95% 90%,#297d7240,transparent 45%),radial-gradient(ellipse at 5% 100%,#7660cf40,transparent 40%),#171123}
.hpc-intro-progress{width:150px;height:3px}.hpc-intro-skip{min-height:42px}
@media(max-width:760px){.hpc-hero-visual{grid-row:1}.hpc-community-label{font-size:9px}.hpc-tv-topline{padding:8px 10px;margin-bottom:10px}.hpc-tv-controls{padding:7px}.hpc-tv-hardware{padding-inline:3px}.hpc-explore-grid{gap:17px 13px}.hpc-connect-section{gap:28px}}
@media(max-width:520px){.hpc-community-label{font-size:8px;letter-spacing:.35px;padding:7px 10px;margin-bottom:13px}.hpc-logo-card{transform:none}.hpc-board-flags .hpc-pride-flag{width:27px;height:19px}.hpc-board-flags .hpc-pride-flags{gap:7px}.hpc-tv-topline{padding:8px;gap:7px}.hpc-tv-hardware{padding:7px 5px;gap:6px}.hpc-channel-dial{border-width:2px}.hpc-tv-controls{padding:6px;margin:8px 0}.hpc-now-playing{padding:12px}.hpc-explore-grid{gap:19px 12px}.hpc-explore-card{padding:23px 13px 15px;transform:none}.hpc-explore-card:nth-child(even){transform:none}.hpc-explore-card>strong{font-size:15px}.hpc-explore-card>span:not(.hpc-explore-icon){font-size:10px}.hpc-explore-arrow{top:24px}.hpc-about-photo{transform:none}.hpc-values article{padding:14px}.hpc-values p{font-size:11px}}
@media(max-width:350px){.hpc-tv-hardware{gap:4px;padding-inline:3px}.hpc-channel-buttons button,.hpc-volume-buttons button{width:29px}.hpc-channel-buttons,.hpc-volume-buttons{gap:3px}.hpc-hardware-label{letter-spacing:0}.hpc-community-label{font-size:7px}}


/* Pride Network partnership card. */
.hpc-network-section{padding-top:18px}
.hpc-network-card{position:relative;display:flex;align-items:center;gap:18px;min-width:0;padding:21px 24px;border:1px solid #e2d2e9;border-radius:22px;background:linear-gradient(115deg,#fff0f3,#fffaf0 40%,#f0f7f5 70%,#f1edff);color:#44314e;box-shadow:0 5px 18px #6844690a;overflow:hidden;transition:box-shadow .2s,border-color .2s}
.hpc-network-card::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ce5979,#d99a64,#c9ae48,#5a9c7a,#6084ba,#a572b3);opacity:.7}
.hpc-network-card:hover{border-color:#ba91bc;box-shadow:0 7px 22px #68446918}
.hpc-network-icon{display:grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border-radius:16px;background:#ffffffba;color:#815079;border:1px solid #e9d8e9;font-size:21px}
.hpc-network-copy{flex:1;min-width:0}
.hpc-network-copy h2{font-size:clamp(17px,1.8vw,23px);font-weight:600;line-height:1.35;letter-spacing:-.3px;text-wrap:balance}
.hpc-network-copy h2 em{color:#805277}
.hpc-network-copy p{margin-top:5px;font-size:12px;line-height:1.5;color:#705c76}
.hpc-network-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 15px;border:1px solid #d9c1dc;border-radius:999px;background:#ffffffb3;color:#704b7c;font-size:12px;font-weight:650;text-align:center;flex-shrink:0}
.hpc-network-cta>svg{flex-shrink:0;font-size:11px}
@media(max-width:760px){.hpc-network-card{flex-wrap:wrap;gap:12px;padding:18px}.hpc-network-copy h2{font-size:19px}.hpc-network-cta{flex-basis:100%}}
@media(max-width:380px){.hpc-network-card{padding:16px 13px;gap:10px}.hpc-network-icon{flex-basis:38px;width:38px;height:38px;font-size:18px;border-radius:12px}.hpc-network-copy h2{font-size:17px}.hpc-network-copy p{font-size:12px}}

/* A soft community-board note; scoped so the welcome intro keeps its neon style. */
.hpc-belonging.hpc-belonging-note{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) auto;gap:24px;padding:24px 28px;border:1px solid #e8d5e5;border-radius:26px;background:radial-gradient(ellipse at 0 0,#ffe5ecaa,transparent 55%),radial-gradient(ellipse at 100% 100%,#e8e3ffaa,transparent 55%),#fffaf7;color:#42314e;box-shadow:0 6px 22px #6844690b;overflow:hidden}
.hpc-belonging.hpc-belonging-note::after{height:3px;opacity:.65;background:linear-gradient(90deg,#da6685,#dfa06b,#d2b84e,#69a786,#698dc0,#aa80ba)}
.hpc-belonging-note .hpc-belonging-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:10px;min-width:0;grid-column:auto}
.hpc-belonging-heart{display:grid;place-items:center;width:36px;height:36px;border-radius:13px;background:#f8e4ed;color:#ac456c;box-shadow:0 2px 0 #fff inset;transform:rotate(-7deg);font-size:15px}
.hpc-belonging-note .hpc-belonging-tagline{font-size:clamp(14px,1.3vw,18px);font-weight:500;line-height:1.5;letter-spacing:.1px;color:#70566e;text-wrap:balance}
.hpc-belonging-note .hpc-belonging-tagline em{display:block;font-size:1.45em;line-height:1.25;color:#805277}
.hpc-belonging-message{min-width:0;text-align:center}
.hpc-belonging-note .hpc-belonging-message h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(22px,2.3vw,29px);font-weight:400;line-height:1.3;letter-spacing:0;margin:0;white-space:normal;color:#59435f}
.hpc-belonging-note .hpc-neon-stage{min-height:78px;margin:0;padding:3px 0 6px}
.hpc-belonging-note .hpc-neon-word{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;font-size:clamp(34px,4vw,54px);line-height:1.2;letter-spacing:-1.3px;color:#805277;text-shadow:none;max-width:100%;overflow-wrap:anywhere}
.hpc-belonging-note .hpc-neon-word.hpc-neon-loved{background:linear-gradient(105deg,#ad365c 8%,#99501f 25%,#786218 40%,#286d50 56%,#365e9e 74%,#7b448d 92%);background-clip:text;-webkit-background-clip:text;color:transparent;filter:none}
.hpc-belonging-note .hpc-belonging-footnote{font-size:12px;line-height:1.5;letter-spacing:.35px;color:#79677d}
.hpc-belonging-note .hpc-replay{display:inline-flex;align-items:center;justify-content:center;gap:7px;grid-column:auto;grid-row:auto;min-width:44px;min-height:44px;height:auto;margin:0;padding:10px 13px;border:1px solid #dec8dd;border-radius:999px;background:#ffffffb3;color:#795473;font-size:12px!important;transition:background .2s,border-color .2s}
.hpc-belonging-note .hpc-replay:hover{background:#f5e5f1;border-color:#bb94b4}
.hpc-belonging-note .hpc-replay svg{font-size:11px;flex-shrink:0}
@media(max-width:760px){
 .hpc-belonging.hpc-belonging-note{grid-template-columns:minmax(0,1fr);gap:14px;padding:20px 16px 16px;border-radius:22px;text-align:center}
 .hpc-belonging-note .hpc-belonging-copy{align-items:center;gap:9px;grid-column:1}
 .hpc-belonging-note .hpc-belonging-tagline{font-size:14px}
 .hpc-belonging-note .hpc-belonging-tagline em{display:inline;font-size:1.15em}
 .hpc-belonging-note .hpc-belonging-message h2{font-size:23px}
 .hpc-belonging-note .hpc-neon-stage{min-height:66px;padding-block:2px 5px}
 .hpc-belonging-note .hpc-neon-word{font-size:clamp(32px,8.5vw,46px);letter-spacing:-1px}
 .hpc-belonging-note .hpc-replay{justify-self:center;grid-column:1;padding:9px 15px}
}
@media(forced-colors:active){.hpc-belonging-note .hpc-neon-word.hpc-neon-loved{background:none;color:CanvasText}.hpc-belonging.hpc-belonging-note{border-color:CanvasText}}
@media(forced-colors:active){.hpc-neon-word.hpc-neon-loved,.hpc-intro-title>span{background:none;color:CanvasText;filter:none}.hpc-channel-dial{border-color:ButtonText}}

@media(prefers-reduced-motion:reduce){.hpc-home *,.hpc-intro *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hpc-pride-flag{opacity:1;transform:rotate(var(--flag-rotation))}.hpc-neon-word{opacity:1;transform:none}.hpc-intro-progress>span{transform:scaleX(1)}}
`;
