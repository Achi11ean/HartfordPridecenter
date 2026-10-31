import React, { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const PRIDE_API = "https://singspacebackend.onrender.com";

export function AdminRecoveryFrame({ children, embedded = false }) {
  return <div className={`par-root ${embedded ? "par-embedded" : "par-page"}`}>
    <style>{styles}</style>
    <section className="par-card" aria-label="Pride admin account recovery">
      <div className="par-rainbow" aria-hidden="true" />
      <p className="par-eyebrow">Pride admin · Here, you belong.</p>
      {children}
    </section>
  </div>;
}

export default function AdminRequestPasswordReset({ onBack, loginPath = "/login", initialUsername = "", embedded = false }) {
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
      await axios.post(`${PRIDE_API}/api/pride-admin/request-password-reset`,
        { username: username.trim(), email: cleanEmail }, { timeout: 30000 });
      setSent(true);
    } catch (err) {
      setError(err.response?.status === 429 ? "Too many requests. Please wait a few minutes."
        : err.code === "ECONNABORTED" ? "The request took longer than expected. Check your inbox before trying again."
        : "We couldn’t process your request. Please try again later.");
    } finally { busy.current = false; setLoading(false); }
  };
  return <AdminRecoveryFrame embedded={embedded}>
    <h1>{sent ? "Check your inbox." : "Let’s get you back in."}</h1>
    {sent ? <div role="status">
      <p>If an active Pride admin account matches the username and email you entered, you’ll receive a link to choose a new six-digit PIN.</p>
      <div className="par-note">The link works once and expires in one hour. Check your spam folder if it hasn’t arrived after a few minutes.</div>
      <button className="par-secondary" onClick={() => { setSent(false); setError(""); }}>Try different details</button>
    </div> : <form onSubmit={handleSubmit} aria-busy={loading}>
      <p>Your community is waiting. Enter your admin username and account email to reset your PIN.</p>
      <label htmlFor={`${id}-username`}>Admin username</label>
      <input id={`${id}-username`} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={100} required disabled={loading} value={username} onChange={e => setUsername(e.target.value)} />
      <label htmlFor={`${id}-email`}>Account email</label>
      <input id={`${id}-email`} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={250} required disabled={loading} value={email} onChange={e => setEmail(e.target.value)} />
      {error && <p className="par-error" role="alert">{error}</p>}
      <button className="par-primary" disabled={loading}>{loading ? "Requesting your link…" : "Email my reset link →"}</button>
    </form>}
    {onBack ? <button type="button" className="par-back" disabled={loading} onClick={onBack}>← Back to login</button> : <Link className="par-back" to={loginPath}>← Back to login</Link>}
  </AdminRecoveryFrame>;
}

const styles = `
.par-root{font:15px/1.7 system-ui,sans-serif;color:#49364e;color-scheme:light}.par-root *{box-sizing:border-box}.par-page{min-height:100svh;padding:160px 18px 60px;background:radial-gradient(ellipse at 0 0,#f7ddeba0,transparent 55%),radial-gradient(ellipse at 100% 100%,#dce8f5aa,transparent 55%),#fcf8f3;display:grid;place-items:center}.par-card{position:relative;width:100%;max-width:520px;margin:auto;background:#fffdfb;border:1px solid #e2d7e5;border-radius:24px;padding:38px;box-shadow:0 18px 65px #55425b0d}.par-rainbow{height:4px;position:absolute;inset:0 24px auto;background:linear-gradient(90deg,#dc7696,#e5aa71,#d6bd63,#77ad8e,#7f9fcd,#a882be);border-radius:0 0 5px 5px}.par-eyebrow{font-size:10px!important;text-transform:uppercase;letter-spacing:1.5px;color:#795980}.par-root h1{font:400 35px/1.15 Georgia,serif;margin:18px 0;color:#49364e}.par-root p{margin:14px 0;color:#74617c;font-size:14px}.par-root label{display:block;font-size:12px;font-weight:700;margin:20px 0 7px}.par-root input{width:100%;min-height:50px;border:1px solid #cbb9d3;border-radius:10px;background:white;color:#49364e;font:16px system-ui;padding:12px}.par-root button,.par-root a{font:inherit}.par-root button{cursor:pointer}.par-root button:disabled{opacity:.65;cursor:wait}.par-root :is(button,a,input):focus-visible{outline:3px solid #9872aa;outline-offset:3px}.par-primary,.par-secondary{display:block;width:100%;min-height:48px;margin-top:24px;padding:12px;border-radius:10px;border:1px solid #795388;background:#795388;color:white;font-weight:600!important}.par-secondary{background:#f5edf8;color:#795388;border-color:#dbc9e3}.par-back{display:inline-flex;align-items:center;min-height:44px;margin-top:20px;border:0;background:transparent;color:#795388;text-decoration:underline;font-size:13px!important}.par-note{background:#f4edf7;border:1px solid #e2d5e8;padding:16px;border-radius:12px;font-size:13px}.par-root .par-error{background:#fff0f3;color:#913c54;border:1px solid #edcbd5;padding:12px;border-radius:10px}.par-embedded .par-card{padding:0;border:0;box-shadow:none;background:none}.par-embedded .par-rainbow{display:none}@media(max-width:500px){.par-card{padding:28px 22px}.par-page{padding-top:130px}.par-root h1{font-size:30px}}`;
