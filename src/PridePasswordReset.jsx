import React, { useId, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { StaffRecoveryFrame, PRIDE_API } from "./PrideRequestPasswordReset";

export default function PridePasswordReset({ loginPath = "/login" }) {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  // A different token remounts the form so stale success state cannot carry over.
  return <ResetForm key={token} token={token} loginPath={loginPath} />;
}

function ResetForm({ token, loginPath }) {
  const id = useId();
  const busy = useRef(false);
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const validToken = /^[A-Za-z0-9_-]{64}$/.test(token);
  const submit = async event => {
    event.preventDefault();
    if (busy.current || !validToken || success) return;
    setError("");
    if (!/^[0-9]{6}$/.test(pin)) { setError("Enter exactly six digits."); return; }
    if (pin !== confirm) { setError("PINs do not match."); return; }
    busy.current = true; setLoading(true);
    try {
      const res = await axios.post(`${PRIDE_API}/api/pride-staff/reset-password`,
        { token, pin, confirm_pin: confirm }, { timeout: 30000 });
      if (res.data?.success !== true) throw new Error("Unexpected response");
      setSuccess(true); setPin(""); setConfirm("");
    } catch (err) {
      setError(err.response?.status === 429 ? "Too many attempts. Please wait a few minutes."
        : err.code === "ECONNABORTED" ? "The request timed out. Try signing in with your new PIN before requesting another link."
        : typeof err.response?.data?.error === "string" ? err.response.data.error
        : "Unable to reset your PIN. Please try again.");
    } finally { busy.current = false; setLoading(false); }
  };
  return <StaffRecoveryFrame>
    <h1>{success ? "You’re ready to return." : "Choose your new PIN."}</h1>
    {success ? <p role="status">Your PIN has been saved. Sign in with your existing username and your new six-digit PIN.</p>
      : !validToken ? <p className="psr-error" role="alert">This reset link is missing or invalid. Request a new link below.</p>
      : <form onSubmit={submit} aria-busy={loading}>
        <p>A fresh start for your Pride staff account. Enter six digits, then confirm them below.</p>
        <label htmlFor={`${id}-pin`}>New six-digit PIN</label>
        <input id={`${id}-pin`} type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={loading} value={pin} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} />
        <label htmlFor={`${id}-confirm`}>Confirm PIN</label>
        <input id={`${id}-confirm`} type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={loading} value={confirm} onChange={e => setConfirm(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} />
        {error && <p className="psr-error" role="alert">{error}</p>}
        <button className="psr-primary" disabled={loading}>{loading ? "Saving your PIN…" : "Save my new PIN →"}</button>
      </form>}
    {!success && <Link className="psr-back" to="/pride-staff/request-password-reset">Request a new reset link</Link>}
    <div><Link className="psr-back" to={loginPath}>← Back to login</Link></div>
  </StaffRecoveryFrame>;
}
