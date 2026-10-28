import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthForm({ mode }) {
  const { authenticate, isLoading } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const isSellerRegistration = mode === "seller-register";
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await authenticate(isLogin ? "login" : "register", {
        ...values,
        role: isSellerRegistration ? "seller" : "user",
      });
      navigate("/account");
    } catch (requestError) {
      setError(
        requestError.response?.data?.errors?.[0]?.msg ||
          requestError.response?.data?.error ||
          "We could not complete that request. Check the details and try again.",
      );
    }
  };

  const heading = isLogin
    ? "Welcome back."
    : isSellerRegistration
      ? "Open your studio."
      : "Join the edit.";
  const intro = isLogin
    ? "Sign in to keep track of your account and seller studio."
    : isSellerRegistration
      ? "Create a seller account to publish and manage your own listings."
      : "Create a collector account to save your place in the catalogue.";

  return (
    <main className="mx-auto my-12 w-[calc(100%-3rem)] max-w-160 max-sm:my-6 max-sm:w-[calc(100%-2rem)]">
      <form onSubmit={submit} className="grid gap-5 border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8 max-sm:p-5">
        <Link to="/" className="text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4">
          ← Back to catalogue
        </Link>
        <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">
          {isLogin
            ? "Returning customer"
            : isSellerRegistration
              ? "Seller registration"
              : "Collector registration"}
        </p>
        <h1 className="font-[var(--font-display)] text-6xl leading-none tracking-[-.05em] max-sm:text-5xl">{heading}</h1>
        <p className="text-[var(--color-muted)]">{intro}</p>
        {!isLogin && (
          <Field
            label="Name"
            value={values.username}
            onChange={(username) => setValues({ ...values, username })}
          />
        )}
        <Field
          label="Email"
          type="email"
          value={values.email}
          onChange={(email) => setValues({ ...values, email })}
        />
        <Field
          label="Password"
          type="password"
          value={values.password}
          onChange={(password) => setValues({ ...values, password })}
        />
        {error && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        <button disabled={isLoading} className="min-h-11 rounded bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-[var(--color-accent-ink)]">
          {isLoading
            ? "Working…"
            : isLogin
              ? "Sign in"
              : isSellerRegistration
                ? "Create seller account"
                : "Create collector account"}
        </button>
        {!isLogin && (
          <Link
            className="text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4"
            to={isSellerRegistration ? "/register" : "/seller/register"}
          >
            {isSellerRegistration
              ? "Looking to shop? Create a collector account →"
              : "Selling something considered? Open a seller account →"}
          </Link>
        )}
        <p className="text-sm text-[var(--color-muted)]">
          {isLogin ? "New to Snitch?" : "Already registered?"}{" "}
          <Link className="font-bold text-[var(--color-accent-deep)] underline" to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Create a collector account" : "Sign in"}
          </Link>
        </p>
      </form>
    </main>
  );
}

function Field({ label, type = "text", value, onChange }) {
  const id = label.toLowerCase();
  return (
    <label className="grid gap-2 text-sm font-bold" htmlFor={id}>
      <span className="text-xs uppercase tracking-[.08em] text-[var(--color-muted)]">{label}</span>
      <input
        id={id}
        required
        type={type}
        value={value}
        className="min-h-11 border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 outline-none focus:border-[var(--color-focus)]"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
