import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthForm({ mode }) {
  const { authenticate, isLoading } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const isSellerRegistration = mode === "seller-register";
  const [error, setError] = useState("");
  const [values, setValues] = useState({ username: "", email: "", password: "" });

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
      setError(requestError.response?.data?.errors?.[0]?.msg || requestError.response?.data?.error || "We could not complete that request. Check the details and try again.");
    }
  };

  const heading = isLogin ? "Welcome back." : isSellerRegistration ? "Open your studio." : "Join the edit.";
  const intro = isLogin ? "Sign in to keep track of your account and seller studio." : isSellerRegistration ? "Create a seller account to publish and manage your own listings." : "Create a collector account to save your place in the catalogue.";

  return <main className="auth-page"><form onSubmit={submit} className="auth-form"><Link to="/" className="back-link">← Back to catalogue</Link><p className="overline">{isLogin ? "Returning customer" : isSellerRegistration ? "Seller registration" : "Collector registration"}</p><h1>{heading}</h1><p className="form-intro">{intro}</p>{!isLogin && <Field label="Name" value={values.username} onChange={(username) => setValues({ ...values, username })} />}<Field label="Email" type="email" value={values.email} onChange={(email) => setValues({ ...values, email })} /><Field label="Password" type="password" value={values.password} onChange={(password) => setValues({ ...values, password })} />{error && <p className="form-error" role="alert">{error}</p>}<button disabled={isLoading} className="button button-primary">{isLoading ? "Working…" : isLogin ? "Sign in" : isSellerRegistration ? "Create seller account" : "Create collector account"}</button>{!isLogin && <Link className="seller-path" to={isSellerRegistration ? "/register" : "/seller/register"}>{isSellerRegistration ? "Looking to shop? Create a collector account →" : "Selling something considered? Open a seller account →"}</Link>}<p className="auth-switch">{isLogin ? "New to Snitch?" : "Already registered?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create a collector account" : "Sign in"}</Link></p></form></main>;
}

function Field({ label, type = "text", value, onChange }) {
  const id = label.toLowerCase();
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} required type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
