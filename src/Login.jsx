import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const INTRO_MS = 3200;
const COLORS = ["#ec82a1", "#eeb279", "#e6cd75", "#88bd9f", "#8daedc", "#b694d2"];

function LoginIcon({ name, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === "heart" ? <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" /> : name === "user" ? <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></> : name === "lock" ? <><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2" /></> : name === "shield" ? <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z" /><path d="m8 12 3 3 5-6" /></> : <path d="M5 12h14m-6-6 6 6-6 6" />}
  </svg>;
}

function RainbowKaleidoscope() {
  return <svg className="hpl-kaleidoscope" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
    <circle cx="160" cy="160" r="143" fill="none" stroke="#e7ddec" strokeWidth="1" />
    <circle cx="160" cy="160" r="114" fill="none" stroke="#e7ddec" strokeWidth="1" strokeDasharray="2 9" />
    <g className="hpl-kaleido-outer">
      {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30} 160 160)`}>
        <path d="M160 34 185 100 160 145 135 100Z" fill={COLORS[i % 6]} opacity=".65" />
        <path d="M160 45 169 100 160 133 151 100Z" fill="#fff" opacity=".55" />
        <circle cx="160" cy="18" r="3" fill={COLORS[i % 6]} />
      </g>)}
    </g>
    <g className="hpl-kaleido-inner">
      {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30 + 15} 160 160)`}>
        <path d="M160 78 177 126 160 157 143 126Z" fill={COLORS[(i + 2) % 6]} opacity=".82" />
      </g>)}
    </g>
    <circle cx="160" cy="160" r="25" fill="#fffcf8" stroke="#e7ddec" />
    <path d="M160 173c-22-14-22-28-10-28 5 0 9 4 10 8 1-4 5-8 10-8 12 0 12 14-10 28Z" fill="#ac769b" />
  </svg>;
}

function WelcomeIntro({ onComplete }) {
  const skipRef = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setTimeout(onComplete, media.matches ? 800 : INTRO_MS);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previousOverflow; };
  }, [onComplete]);
  return createPortal(<div className="hpl-intro" role="dialog" aria-modal="true" aria-labelledby="hpl-intro-title" onKeyDown={event => {
    if (event.key === "Escape") onComplete();
    if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); }
  }}>
    <div className="hpl-intro-content">
      <p className="hpl-eyebrow">Hartford Pride Center</p>
      <RainbowKaleidoscope />
      <h1 id="hpl-intro-title">Welcome <em>Back.</em></h1>
      <p className="hpl-intro-note">Every color. Every identity. One community.</p>
      <div className="hpl-intro-progress" aria-hidden="true"><span /></div>
      <button ref={skipRef} type="button" className="hpl-skip" onClick={onComplete}>Skip intro <LoginIcon name="arrow" size={12} /></button>
    </div>
  </div>, document.body);
}

export default function Login() {
  const [mode, setMode] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");
  const usernameRef = useRef(null);
  const submittingRef = useRef(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const finishIntro = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    if (!showIntro) usernameRef.current?.focus({ preventScroll: true });
  }, [showIntro]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
    if (error) setError("");
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError("");
    const endpoint = mode === "admin" ? "/api/pride-admin/login" : "/api/pride-staff/login";
    try {
      const res = await axios.post(`${API}${endpoint}`, { username: form.username, pin: form.pin });
      login({ token: res.data.token, role: mode, user: mode === "admin" ? res.data.admin : res.data.staff });
      toast.success(`Welcome ${mode === "admin" ? "Pride Admin" : "Pride Staff"} 🎉`);
      navigate(mode === "admin" ? "/admin-dashboard" : "/staff-dashboard");
    } catch (err) {
      const message = typeof err.response?.data?.error === "string" ? err.response.data.error : "Login failed. Please check your username and PIN.";
      setError(message);
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return <>
    <style>{STYLES}</style>
    {showIntro ? <WelcomeIntro onComplete={finishIntro} /> : <main className="hpl-page">
      <div className="hpl-shell">
        <aside className="hpl-story" aria-label="Welcome to the Pride community">
          <div className="hpl-story-brand"><span className="hpl-brand-heart"><LoginIcon name="heart" size={23} /></span><span>Hartford<br /><strong>Pride Center</strong></span></div>
          <div className="hpl-story-middle"><div className="hpl-static-pattern"><RainbowKaleidoscope /></div><p className="hpl-eyebrow">A little care. A lot of belonging.</p><h2>Good people.<br /><em>Meaningful work.</em></h2><p>Welcome to your community workspace. Thank you for making room for everyone.</p></div>
          <div className="hpl-story-foot"><span className="hpl-color-dots" aria-hidden="true">{COLORS.map(color => <i key={color} style={{ background: color }} />)}</span><span>Every identity. One community.</span></div>
        </aside>

        <section className="hpl-card" aria-labelledby="hpl-login-title">
          <div className="hpl-mobile-brand"><LoginIcon name="heart" size={18} /><span>Hartford Pride Center</span></div>
          <div className="hpl-login-heading"><span className="hpl-login-icon"><LoginIcon name="lock" size={23} /></span><p className="hpl-eyebrow">Your community workspace</p><h1 id="hpl-login-title">Welcome back<span>.</span></h1><p>Sign in and pick up where you left off.</p></div>
          <div className="hpl-role-switch" role="group" aria-label="Choose your login role">
            {["admin", "staff"].map(value => <button key={value} type="button" disabled={loading} aria-pressed={mode === value} className={mode === value ? "is-active" : ""} onClick={() => { setMode(value); setError(""); }}><LoginIcon name={value === "admin" ? "shield" : "user"} size={17} />{value === "admin" ? "Admin" : "Staff"}</button>)}
          </div>
          <form onSubmit={handleSubmit} className="hpl-form" aria-busy={loading}>
            <div className="hpl-field"><label htmlFor="hpl-username">Username</label><div className="hpl-input-wrap"><LoginIcon name="user" size={17} /><input id="hpl-username" ref={usernameRef} name="username" placeholder="Enter your username" value={form.username} onChange={handleChange} required autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={loading} aria-describedby={error ? "hpl-error" : undefined} /></div></div>
            <div className="hpl-field"><label htmlFor="hpl-pin">PIN</label><div className="hpl-input-wrap"><LoginIcon name="lock" size={17} /><input id="hpl-pin" type={showPin ? "text" : "password"} name="pin" placeholder="Enter your PIN" value={form.pin} onChange={handleChange} required autoComplete="current-password" disabled={loading} aria-describedby={error ? "hpl-error" : undefined} /><button type="button" className="hpl-show-pin" disabled={loading} onClick={() => setShowPin(value => !value)} aria-pressed={showPin} aria-label={showPin ? "Hide PIN" : "Show PIN"}>{showPin ? "Hide" : "Show"}</button></div></div>
            {error && <p id="hpl-error" className="hpl-error" role="alert">{error}</p>}
            <button type="submit" className="hpl-submit" disabled={loading}>{loading ? <><span className="hpl-spinner" aria-hidden="true" />Signing in…</> : <>Sign in as {mode === "admin" ? "Admin" : "Staff"}<LoginIcon name="arrow" size={18} /></>}</button>
            <p className="hpl-login-note" aria-live="polite">{loading ? "Checking your details. Please wait." : `Use your ${mode} username and PIN to continue.`}</p>
          </form>
          <div className="hpl-card-footer"><LoginIcon name="heart" size={13} /><span>Here, you belong.</span></div>
        </section>
      </div>
      <p className="hpl-page-footer">Hartford Pride Center · Built around belonging.</p>
    </main>}
  </>;
}

const STYLES = `
.hpl-page,.hpl-intro{font:14px/1.6 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#3b3045;color-scheme:light;-webkit-font-smoothing:antialiased}
.hpl-page *,.hpl-intro *{box-sizing:border-box}.hpl-page :is(h1,h2,p),.hpl-intro :is(h1,p){margin:0}.hpl-page button,.hpl-intro button{font-family:inherit;cursor:pointer}.hpl-page button:disabled{cursor:wait;opacity:.65}.hpl-page button:focus-visible,.hpl-intro button:focus-visible{outline:3px solid #876498;outline-offset:4px}
.hpl-page{--hpl-header-offset:148px;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:calc(var(--hpl-header-offset) + 22px) 16px 25px;background:radial-gradient(ellipse at 10% 10%,#f6dce880,transparent 40%),radial-gradient(ellipse at 90% 95%,#e2e9f780,transparent 45%),#f9f6f2}
.hpl-shell{position:relative;width:100%;max-width:920px;display:grid;grid-template-columns:1fr 1fr;border:1px solid #e2d7e5;border-radius:24px;background:#fffdfb;box-shadow:0 18px 65px #55425b0d}
.hpl-shell::before{content:"";position:absolute;inset:0 22px auto;height:4px;border-radius:0 0 7px 7px;background:linear-gradient(90deg,#dc7696,#e5aa71,#d6bd63,#77ad8e,#7f9fcd,#a882be);z-index:1}
.hpl-story{padding:29px 32px;display:flex;flex-direction:column;justify-content:space-between;min-width:0;border-right:1px solid #e8dfe8;border-radius:24px 0 0 24px;background:radial-gradient(ellipse at 0 10%,#fde2eb,transparent 65%),linear-gradient(155deg,#fbf4e8,#eff3ed 60%,#efeafa)}
.hpl-story-brand{display:flex;gap:10px;align-items:center;color:#694b70;font-size:12px;line-height:1.4}.hpl-story-brand strong{font-size:15px}.hpl-brand-heart{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;border:1px solid #e4ccdc;background:#fff8;color:#ab7196}
.hpl-story-middle{padding:17px 0 24px}.hpl-static-pattern{width:170px;max-width:100%;margin:0 auto 11px}.hpl-static-pattern .hpl-kaleido-outer,.hpl-static-pattern .hpl-kaleido-inner{animation:none}.hpl-eyebrow{font-size:9px;font-weight:750;letter-spacing:1.25px;text-transform:uppercase;color:#85708b}.hpl-story h2{font:400 36px/1.19 Georgia,serif;letter-spacing:-.7px;margin:12px 0 14px;color:#4c3c56}.hpl-story h2 em{color:#886480}.hpl-story-middle>p:last-child{font-size:12px;color:#74677b;max-width:290px;line-height:1.85}.hpl-story-foot{display:flex;flex-wrap:wrap;gap:8px 11px;align-items:center;font-size:9px;color:#796981}.hpl-color-dots{display:flex;gap:4px}.hpl-color-dots i{display:block;width:9px;height:9px;border-radius:50%}
.hpl-card{padding:43px 35px 27px;min-width:0}.hpl-login-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;border:1px solid #e5d7eb;background:#f1e9f7;color:#856195;margin-bottom:19px}.hpl-login-heading h1{font-size:31px;font-weight:750;line-height:1.3;letter-spacing:-1px;color:#3c2e46;margin:7px 0 8px}.hpl-login-heading h1>span{color:#b47698}.hpl-login-heading>p:last-child{font-size:12px;color:#796b82}
.hpl-role-switch{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;margin:24px 0 21px;border:1px solid #e3d9e7;background:#f4f0f6;border-radius:12px}.hpl-role-switch>button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:41px;border:1px solid transparent;border-radius:8px;background:transparent;font-size:12px;font-weight:650;color:#80718a}.hpl-role-switch>button.is-active{background:#fff;color:#755187;border-color:#dfcee8;box-shadow:0 2px 5px #56356508}
.hpl-form{display:grid;gap:16px}.hpl-field{min-width:0}.hpl-field>label{display:block;margin-bottom:6px;font-size:11px;font-weight:750;color:#5d4b66}.hpl-input-wrap{display:flex;align-items:center;gap:10px;border:1px solid #ded3e4;border-radius:10px;background:#fff;min-height:48px;padding-left:13px;transition:border-color .15s,box-shadow .15s}.hpl-input-wrap>svg{flex-shrink:0;color:#a08bab}.hpl-input-wrap:focus-within{border-color:#9c78b0;box-shadow:0 0 0 3px #a07ab515}.hpl-input-wrap input{display:block;min-width:0;width:100%;border:0;outline:none;background:transparent;color:#42314e;padding:12px 10px 12px 0;font-family:inherit;font-weight:400;font-size:16px;line-height:1.4;border-radius:10px}.hpl-input-wrap input::placeholder{color:#a297a7;font-size:12px}.hpl-input-wrap input:disabled{opacity:.65}.hpl-show-pin{align-self:stretch;flex-shrink:0;min-width:49px;min-height:44px;border:0;border-radius:0 10px 10px 0;background:transparent;color:#85658f;font-size:10px;font-weight:750;padding:8px}.hpl-show-pin:hover{background:#f7effa}
.hpl-submit{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:48px;padding:12px;border:1px solid #725087;border-radius:10px;background:linear-gradient(110deg,#916386,#73518c);color:#fff;font-size:13px;font-weight:750;box-shadow:0 4px 10px #7a4d8918;transition:filter .2s;margin-top:4px}.hpl-submit:hover:not(:disabled){filter:brightness(.94)}.hpl-login-note{font-size:10px;color:#81728b;text-align:center;line-height:1.6}.hpl-error{font-size:12px;color:#993f58;background:#fff0f3;border:1px solid #edcbd5;padding:10px 12px;border-radius:9px;overflow-wrap:anywhere}.hpl-spinner{width:15px;height:15px;border:2px solid #ffffff50;border-top-color:#fff;border-radius:50%;animation:hpl-spin .7s linear infinite}
.hpl-card-footer{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:26px;padding-top:17px;border-top:1px solid #eee6ee;font-size:10px;color:#9b7a95}.hpl-page-footer{margin-top:19px!important;font-size:10px;color:#918397;text-align:center}.hpl-mobile-brand{display:none}
.hpl-intro{position:fixed;inset:0;z-index:2147483000;overflow:auto;display:flex;align-items:center;justify-content:center;min-height:100dvh;padding:25px;background:radial-gradient(ellipse at 0 0,#f7ddeba0,transparent 50%),radial-gradient(ellipse at 100% 100%,#e1e8f8aa,transparent 50%),#fcf8f3}
.hpl-intro-content{width:100%;max-width:400px;text-align:center;margin:auto}.hpl-intro-content>.hpl-eyebrow{color:#7a6287}.hpl-kaleidoscope{display:block;width:100%;height:auto}.hpl-intro .hpl-kaleidoscope{width:min(270px,65vw,42dvh);margin:21px auto 17px}.hpl-kaleido-outer,.hpl-kaleido-inner{transform-origin:160px 160px}.hpl-kaleido-outer{animation:hpl-spin 16s linear infinite}.hpl-kaleido-inner{animation:hpl-spin 12s linear infinite reverse}.hpl-intro h1{font:400 clamp(33px,6vw,43px)/1.2 Georgia,serif;letter-spacing:-1px;color:#44344f}.hpl-intro h1 em{color:#876382}.hpl-intro-note{font-size:12px;color:#807087;margin-top:12px!important}.hpl-intro-progress{width:105px;height:3px;margin:25px auto 13px;background:#e9deea;border-radius:9px;overflow:hidden}.hpl-intro-progress>span{display:block;height:100%;background:linear-gradient(90deg,#ce718f,#d9b267,#77a895,#819dc7,#ab84be);transform-origin:left;animation:hpl-intro-progress ${INTRO_MS}ms linear both}.hpl-skip{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:28px;padding:4px 10px;background:#fffc;border:1px solid #dfd1e5;border-radius:99px;color:#7c6389;font-size:10px}.hpl-skip:hover{background:#f1e7f7}
@keyframes hpl-spin{to{transform:rotate(360deg)}}@keyframes hpl-intro-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:650px){.hpl-page{--hpl-header-offset:108px;padding-inline:13px;padding-top:calc(var(--hpl-header-offset) + 18px);justify-content:flex-start}.hpl-shell{display:block;max-width:420px;border-radius:20px}.hpl-story{display:none}.hpl-card{padding:25px 22px 22px}.hpl-mobile-brand{display:flex;align-items:center;gap:7px;font-size:10px;color:#8d6c8b;margin-bottom:25px}.hpl-login-icon{width:41px;height:41px;border-radius:13px;margin-bottom:14px}.hpl-login-heading h1{font-size:30px}.hpl-role-switch{margin-top:21px;margin-bottom:19px}.hpl-card-footer{margin-top:23px}.hpl-page-footer{font-size:9px}.hpl-intro-note{font-size:11px}}
@media(max-width:360px){.hpl-card{padding:24px 17px 19px}.hpl-page{padding-inline:10px}.hpl-login-heading h1{font-size:28px}}
@media(prefers-reduced-motion:reduce){.hpl-kaleido-outer,.hpl-kaleido-inner,.hpl-spinner{animation:none}.hpl-intro-progress>span{animation:none;transform:scaleX(1)}.hpl-page *{transition:none!important}}
`;
