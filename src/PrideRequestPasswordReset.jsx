import React, { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const PRIDE_API = "https://singspacebackend.onrender.com";

export function StaffRecoveryFrame({ children, embedded = false }) {
  return <div className={`psr-root ${embedded ? "psr-embedded" : "psr-page"}`}>
    <style>{styles}</style>
    <section className="psr-card" aria-label="Pride staff account recovery">
      <div className="psr-rainbow" aria-hidden="true" />
      <p className="psr-eyebrow">Pride staff · Here, you belong.</p>
      {children}
    </section>
  </div>;
}

export default function PrideRequestPasswordReset({ onBack, loginPath = "/login", initialUsername = "", embedded = false }) {
  const id = useId();
  const busy = useRef(false);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = async event => {
    event.preventDefault();
    if (busy.current) return;
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!username.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      setError("Enter your username and a valid email address."); return;
    }
    busy.current = true; setLoading(true);
    try {
      await axios.post(`${PRIDE_API}/api/pride-staff/request-password-reset`,
        { username: username.trim(), email: cleanEmail }, { timeout: 30000 });
      setSent(true);
    } catch (err) {
      setError(err.response?.status === 429 ? "Too many requests. Please wait a few minutes."
        : err.code === "ECONNABORTED" ? "The request took longer than expected. Check your inbox before trying again."
        : "We couldn’t process your request. Please try again later.");
    } finally { busy.current = false; setLoading(false); }
  };
  return <StaffRecoveryFrame embedded={embedded}>
    <h1>{sent ? "Check your inbox." : "Let’s get you back in."}</h1>
    {sent ? <div role="status">
      <p>If an active Pride staff account matches the username and email you entered, you’ll receive a link to choose a new six-digit PIN.</p>
      <div className="psr-note">The link works once and expires in one hour. Check your spam folder if it hasn’t arrived after a few minutes.</div>
      <button className="psr-secondary" onClick={() => { setSent(false); setError(""); }}>Try different details</button>
    </div> : <form onSubmit={handleSubmit} aria-busy={loading}>
      <p>Your community is waiting. Enter your staff username and account email to reset your PIN.</p>
      <label htmlFor={`${id}-username`}>Staff username</label>
      <input id={`${id}-username`} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={100} required disabled={loading} value={username} onChange={e => setUsername(e.target.value)} />
      <label htmlFor={`${id}-email`}>Account email</label>
      <input id={`${id}-email`} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={250} required disabled={loading} value={email} onChange={e => setEmail(e.target.value)} />
      {error && <p className="psr-error" role="alert">{error}</p>}
      <button className="psr-primary" disabled={loading}>{loading ? "Requesting your link…" : "Email my reset link →"}</button>
    </form>}
    <p className="psr-note">No email on your staff account, or no longer able to access it? Ask your Pride admin to update your account email before requesting a reset.</p>
    {onBack ? <button type="button" className="psr-back" disabled={loading} onClick={onBack}>← Back to login</button> : <Link className="psr-back" to={loginPath}>← Back to login</Link>}
  </StaffRecoveryFrame>;
}

const styles = `
.psr-root{font:15px/1.7 system-ui,sans-serif;color:#49364e;color-scheme:light}.psr-root *{box-sizing:border-box}.psr-page{min-height:100svh;padding:160px 18px 60px;background:radial-gradient(ellipse at 0 0,#f7ddeba0,transparent 55%),radial-gradient(ellipse at 100% 100%,#dce8f5aa,transparent 55%),#fcf8f3;display:grid;place-items:center}.psr-card{position:relative;width:100%;max-width:520px;margin:auto;background:#fffdfb;border:1px solid #e2d7e5;border-radius:24px;padding:38px;box-shadow:0 18px 65px #55425b0d}.psr-rainbow{height:4px;position:absolute;inset:0 24px auto;background:linear-gradient(90deg,#dc7696,#e5aa71,#d6bd63,#77ad8e,#7f9fcd,#a882be);border-radius:0 0 5px 5px}.psr-eyebrow{font-size:10px!important;text-transform:uppercase;letter-spacing:1.5px;color:#795980}.psr-root h1{font:400 35px/1.15 Georgia,serif;margin:18px 0;color:#49364e}.psr-root p{margin:14px 0;color:#74617c;font-size:14px}.psr-root label{display:block;font-size:12px;font-weight:700;margin:20px 0 7px}.psr-root input{width:100%;min-height:50px;border:1px solid #cbb9d3;border-radius:10px;background:white;color:#49364e;font:16px system-ui;padding:12px}.psr-root button,.psr-root a{font:inherit}.psr-root button{cursor:pointer}.psr-root button:disabled{opacity:.65;cursor:wait}.psr-root :is(button,a,input):focus-visible{outline:3px solid #9872aa;outline-offset:3px}.psr-primary,.psr-secondary{display:block;width:100%;min-height:48px;margin-top:24px;padding:12px;border-radius:10px;border:1px solid #795388;background:#795388;color:white;font-weight:600!important}.psr-secondary{background:#f5edf8;color:#795388;border-color:#dbc9e3}.psr-back{display:inline-flex;align-items:center;min-height:44px;margin-top:20px;border:0;background:transparent;color:#795388;text-decoration:underline;font-size:13px!important}.psr-note{background:#f4edf7;border:1px solid #e2d5e8;padding:16px;border-radius:12px;font-size:13px}.psr-root .psr-error{background:#fff0f3;color:#913c54;border:1px solid #edcbd5;padding:12px;border-radius:10px}.psr-embedded .psr-card{padding:0;border:0;box-shadow:none;background:none}.psr-embedded .psr-rainbow{display:none}@media(max-width:500px){.psr-card{padding:28px 22px}.psr-page{padding-top:130px}.psr-root h1{font-size:30px}}`;
