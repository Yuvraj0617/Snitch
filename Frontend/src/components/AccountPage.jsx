import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProducts } from "../context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";
import { useState } from "react";

export default function AccountPage() {
  const { user } = useAuth();
  const { products, deleteProduct } = useProducts();
  const [status, setStatus] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const sellerProducts = products.filter((product) => {
    const sellerId =
      typeof product.seller === "object" ? product.seller?._id : product.seller;
    return String(sellerId) === String(user.id);
  });
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`))
      return;
    setStatus("");
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
    } catch (requestError) {
      setStatus(
        requestError.response?.data?.message ||
          "The product could not be deleted.",
      );
    } finally {
      setDeletingId("");
    }
  };
  return (
    <main className="mx-auto w-[calc(100%-3rem)] max-w-304 py-18 max-sm:w-[calc(100%-2rem)] max-sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Your account</p>
      <h1 className="mb-6 font-[var(--font-display)] text-6xl leading-none tracking-[-.05em]">Hello, {user.username || user.email}.</h1>
      <section className="mb-6 grid grid-cols-[1fr_1fr_auto] items-end gap-6 border-y border-[var(--color-rule)] p-6 max-md:grid-cols-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Signed in as</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Access</p>
          <p>{user.role === "seller" ? "Seller" : "Collector"}</p>
        </div>
        {user.role === "seller" && (
          <Link className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-[var(--color-accent-ink)]" to="/seller/products/new">
            Add a product
          </Link>
        )}
      </section>
      {user.role === "seller" && (
        <section
          className="mt-12"
          aria-labelledby="seller-listings-title"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Seller studio</p>
              <h2 id="seller-listings-title" className="font-[var(--font-display)] text-4xl font-normal tracking-[-.04em]">Your listings</h2>
            </div>
            <span>{sellerProducts.length} published</span>
          </div>
          {status && (
            <p className="text-sm text-[var(--color-error)]" role="alert">
              {status}
            </p>
          )}
          {sellerProducts.length === 0 ? (
            <div className="grid gap-2 border border-[var(--color-rule)] p-6">
              <p>You have no published listings yet.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {sellerProducts.map((product) => (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-t border-[var(--color-rule)] pt-4 max-sm:grid-cols-1" key={product._id}>
                  <ProductCard product={product} />
                  <div className="flex gap-2">
                    <Link
                      className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm font-bold"
                      to={`/seller/products/${product._id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded border border-[var(--color-accent)] px-4 py-2 text-sm font-bold text-[var(--color-accent-deep)]"
                      disabled={deletingId === product._id}
                      onClick={() => handleDelete(product)}
                    >
                      {deletingId === product._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      <Link className="mt-6 inline-block text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4" to="/products">
        Return to the catalogue →
      </Link>
    </main>
  );
}
