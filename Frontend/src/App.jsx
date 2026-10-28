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
    <main className="page-shell home-page">
      <section className="catalogue-intro" aria-labelledby="home-title">
        <div>
          <p className="overline">Snitch / online catalogue</p>
          <h1 id="home-title">Objects of daily distinction.</h1>
        </div>
        <p className="intro-copy">
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
    <footer className="site-footer">
      <p className="footer-mark">SNITCH.</p>
      <p className="footer-line">
        A quieter way to discover what is worth keeping.
      </p>
      <p className="footer-meta">Catalogue · Account · Seller studio</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app-shell">
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
