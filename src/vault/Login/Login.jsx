import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (error) {
      setError(
        error?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="vault-login" id="vault">
      <div className="vault-login-card">
        <div className="vault-login-header">
          <span className="vault-icon" aria-hidden="true">
            🔐
          </span>

          <h1>Private Vault</h1>

          <p>
            Secure access to private documents and protected
            resources.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="vault-email">
              Email Address
            </label>

            <input
              id="vault-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vault-password">
              Password
            </label>

            <input
              id="vault-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="vault-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="vault-login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
