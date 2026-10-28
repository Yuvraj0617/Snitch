import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setCompact(currentY > 56 && currentY > previousY);
      previousY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header
      className={`site-header ${compact && !dismissed ? "is-compact" : ""} ${dismissed ? "is-dismissed" : ""}`}
    >
      {!dismissed && (
        <div className="announcement" role="status">
          <span>For collectors and independent sellers.</span>
          <button
            className="icon-button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      )}
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/" className="brand">
          SNITCH<span>.</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/products">Catalogue</NavLink>
          {user && <NavLink to="/account">Account</NavLink>}
          {user?.role === "seller" && (
            <NavLink to="/seller/products/new">Seller studio</NavLink>
          )}
        </div>
        <div className="nav-actions">
          {user ? (
            <button className="text-button" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <Link className="nav-cta" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
