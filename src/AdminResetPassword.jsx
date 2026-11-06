import React, { useId, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { StaffRecoveryFrame, PRIDE_API } from "./PrideRequestPasswordReset";

/**
 * Pride admin PIN reset page.
 * Frontend URL: /pride-admin/reset-password?token=...
 * Backend: POST /api/pride-admin/reset-password
 */
export default function AdminResetPassword({ loginPath = "/pride-admin/login" }) {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  // A new token should always start with a fresh form state.
  return <AdminResetForm key={token} token={token} loginPath={loginPath} />;
}

function AdminResetForm({ token, loginPath }) {
  const id = useId();
  const busy = useRef(false);
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Matches Python's secrets.token_urlsafe(48) / 64 URL-safe characters.
  const validToken = /^[A-Za-z0-9_-]{64}$/.test(token);

  const submit = async (event) => {
    event.preventDefault();
    if (busy.current || !validToken || success) return;

    setError("");
    if (!/^[0-9]{6}$/.test(pin)) {
      setError("Enter exactly six digits.");
      return;
    }
    if (pin !== confirm) {
      setError("PINs do not match.");
      return;
    }

    busy.current = true;
    setLoading(true);

    try {
      const res = await axios.post(
        `${PRIDE_API}/api/pride-admin/reset-password`,
        { token, pin, confirm_pin: confirm },
        { timeout: 30000 }
      );

      if (res.data?.success !== true) {
        throw new Error("Unexpected reset response");
      }

      setSuccess(true);
      setPin("");
      setConfirm("");
    } catch (err) {
      setError(
        err.response?.status === 429
          ? "Too many attempts. Please wait a few minutes."
          : err.code === "ECONNABORTED"
            ? "The request timed out. Try signing in with your new PIN before requesting another link."
            : typeof err.response?.data?.error === "string"
              ? err.response.data.error
              : "Unable to reset your admin PIN. Please try again."
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  return (
    <StaffRecoveryFrame>
      <h1>{success ? "Your admin PIN is updated." : "Choose your new admin PIN."}</h1>

      {success ? (
        <p role="status">
          Your new PIN has been saved. Sign in to your Pride admin account using
          your existing username and new six-digit PIN.
        </p>
      ) : !validToken ? (
        <p className="psr-error" role="alert">
          This reset link is missing or invalid. Request a new admin reset link below.
        </p>
      ) : (
        <form onSubmit={submit} aria-busy={loading}>
          <p>
            Set a new six-digit PIN for your Pride admin account, then confirm it below.
          </p>

          <label htmlFor={`${id}-pin`}>New six-digit PIN</label>
          <input
            id={`${id}-pin`}
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            required
            disabled={loading}
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
          />

          <label htmlFor={`${id}-confirm`}>Confirm new PIN</label>
          <input
            id={`${id}-confirm`}
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            required
            disabled={loading}
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
          />

          {error && (
            <p className="psr-error" role="alert">
              {error}
            </p>
          )}

          <button className="psr-primary" type="submit" disabled={loading}>
            {loading ? "Saving your PIN…" : "Save my new PIN →"}
          </button>
        </form>
      )}

      {!success && (
        <Link className="psr-back" to="/pride-admin/request-password-reset">
          Request a new admin reset link
        </Link>
      )}

      <div>
        <Link className="psr-back" to={loginPath}>
          ← Back to admin login
        </Link>
      </div>
    </StaffRecoveryFrame>
  );
}
