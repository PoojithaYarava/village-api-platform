import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@villageapi.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login({ email, password });

    if (!result.success) {
      setError(result.error || "Unable to sign in");
      return;
    }

    const target = (location.state as { from?: string } | null)?.from;
    navigate(target || "/", { replace: true });
  }

  return (
    <div className="login-page">
      <div className="background-grid" />
      <section className="login-card">
        <div className="login-copy">
          <p className="panel-kicker">Demo sign in</p>
          <h1>Access the protected product areas.</h1>
          <p className="body-copy">
            Admin and Client routes now use a lightweight demo login so the flow feels closer to
            the real SaaS product.
          </p>
        </div>

        <div className="login-credentials">
          <div className="credential-hint">
            <strong>Admin</strong>
            <span>`admin@villageapi.local`</span>
            <span>`Admin@123`</span>
          </div>
          <div className="credential-hint">
            <strong>Client</strong>
            <span>`client@villageapi.local`</span>
            <span>`Client@123`</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="login-error">{error}</p> : null}
          <button className="primary-chip login-submit" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </div>
  );
}
