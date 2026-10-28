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
      className={`sticky top-0 z-20 bg-[var(--color-paper)] transition-transform duration-300 ${compact && !dismissed ? "-translate-y-11" : ""}`}
    >
      {!dismissed && (
        <div className="flex min-h-11 items-center justify-center gap-3 bg-[var(--color-accent)] text-xs uppercase tracking-[.08em] text-[var(--color-accent-ink)]" role="status">
          <span>For collectors and independent sellers.</span>
          <button
            className="min-h-11 min-w-11 bg-transparent text-xl leading-none"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      )}
      <nav className="mx-auto grid min-h-18 w-[calc(100%-3rem)] max-w-304 grid-cols-3 items-center gap-4 max-md:grid-cols-[auto_1fr]" aria-label="Main navigation">
        <Link to="/" className="font-[var(--font-display)] text-3xl font-bold tracking-[-.06em]">
          SNITCH<span className="text-[var(--color-accent)]">.</span>
        </Link>
        <div className="flex gap-6 text-sm max-md:hidden">
          <NavLink to="/products">Catalogue</NavLink>
          {user && <NavLink to="/account">Account</NavLink>}
          {user?.role === "seller" && (
            <NavLink to="/seller/products/new">Seller studio</NavLink>
          )}
        </div>
        <div className="justify-self-end">
          {user ? (
            <button className="text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <Link className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm font-bold" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
