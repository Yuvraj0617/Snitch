import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import AuthForm from "./components/AuthForm.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import AccountPage from "./components/AccountPage.jsx";
import SellerProductForm from "./components/SellerProductForm.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function RequireAuth({ children, sellerOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (sellerOnly && user.role !== "seller")
    return <Navigate to="/account" replace />;
  return children;
}

function HomePage() {
  return (
    <main className="mx-auto w-[calc(100%-3rem)] max-w-304 py-18 max-sm:w-[calc(100%-2rem)] max-sm:py-12">
      <section className="grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-6" aria-labelledby="home-title">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Snitch / online catalogue</p>
          <h1 id="home-title" className="font-[var(--font-display)] text-[clamp(3rem,7vw,6.5rem)] leading-none tracking-[-.06em]">Objects of daily distinction.</h1>
        </div>
        <p className="max-w-md self-end text-lg text-[var(--color-muted)]">
          A considered edit from independent sellers. Browse what is published,
          then sign in when you are ready to keep your place.
        </p>
      </section>
      <ProductGrid />
    </main>
  );
}

function AuthPage({ mode }) {
  return <AuthForm mode={mode} />;
}

function Footer() {
  return (
    <footer className="mx-auto mt-auto grid w-[calc(100%-3rem)] max-w-304 grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-6 border-t border-[var(--color-rule)] py-12 text-sm text-[var(--color-muted)] max-sm:grid-cols-1 max-sm:gap-2 max-sm:w-[calc(100%-2rem)]">
      <p className="font-[var(--font-display)] text-3xl font-bold tracking-[-.06em] text-[var(--color-ink)]">SNITCH.</p>
      <p className="max-w-100">
        A quieter way to discover what is worth keeping.
      </p>
      <p className="justify-self-end max-sm:justify-self-start">Catalogue · Account · Seller studio</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/seller/register"
          element={<AuthPage mode="seller-register" />}
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          }
        />
        <Route
          path="/seller/products/new"
          element={
            <RequireAuth sellerOnly>
              <SellerProductForm />
            </RequireAuth>
          }
        />
        <Route
          path="/seller/products/:productId/edit"
          element={
            <RequireAuth sellerOnly>
              <SellerProductForm />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
