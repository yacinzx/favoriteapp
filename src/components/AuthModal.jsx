import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";

function humanize(message) {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Wrong email or password.";
  if (m.includes("user already registered")) return "That email is already registered — try signing in.";
  if (m.includes("password should be at least"))
    return "Password must be at least 6 characters.";
  if (m.includes("unable to validate email")) return "Please enter a valid email address.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first — check your inbox.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  return message;
}

function AuthModal({ open, onClose, initialMode = "signin" }) {
  const { isConfigured, signUp, signIn } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isSignUp = mode === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim() || !password) {
      setError("Enter both your email and a password.");
      return;
    }

    setBusy(true);
    try {
      if (isSignUp) {
        const { needsConfirmation } = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setInfo("Account created! Check your email to confirm it, then sign in.");
          setMode("signin");
          setPassword("");
        } else {
          onClose();
        }
      } else {
        await signIn(email.trim(), password);
        onClose();
      }
    } catch (err) {
      setError(humanize(err?.message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isSignUp ? "Create an account" : "Sign in"}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="modal-head">
          <span className="modal-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>
          <h2 className="modal-title">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="modal-sub">
            {isSignUp
              ? "Save your favorites to the cloud and pick up on any device."
              : "Sign in to sync your favorites across all your devices."}
          </p>
        </div>

        {isConfigured ? (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />
            </div>

            <div className="field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
              />
            </div>

            {error && (
              <p className="auth-message auth-error" role="alert">
                {error}
              </p>
            )}
            {info && <p className="auth-message auth-info">{info}</p>}

            <button
              type="submit"
              className="btn-primary modal-submit"
              disabled={busy}
            >
              {busy
                ? "Please wait…"
                : isSignUp
                  ? "Sign up"
                  : "Sign in"}
            </button>

            <p className="auth-switch">
              {isSignUp ? "Already have an account?" : "New to AniFav?"}{" "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode(isSignUp ? "signin" : "signup");
                  setError(null);
                  setInfo(null);
                }}
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
          </form>
        ) : (
          <div className="auth-notconfigured">
            <p>
              Cloud sync isn't connected yet, so favorites are saved on this
              device only.
            </p>
            <p className="auth-hint">
              Add your Supabase keys to a <code>.env</code> file (see
              <code> .env.example</code>) and restart the dev server to enable
              accounts and cross-device sync.
            </p>
            <button type="button" className="btn-ghost" onClick={onClose}>
              Continue on this device
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
