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
    const sellerId = typeof product.seller === "object" ? product.seller?._id : product.seller;
    return String(sellerId) === String(user.id);
  });
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    setStatus("");
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || "The product could not be deleted.");
    } finally {
      setDeletingId("");
    }
  };
  return (
    <main className="page-shell account-page">
      <p className="overline">Your account</p>
      <h1>Hello, {user.username || user.email}.</h1>
      <section className="account-panel">
        <div>
          <p className="account-label">Signed in as</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="account-label">Access</p>
          <p>{user.role === "seller" ? "Seller" : "Collector"}</p>
        </div>
        {user.role === "seller" && (
          <Link className="button button-primary" to="/seller/products/new">
            Add a product
          </Link>
        )}
      </section>
      {user.role === "seller" && (
        <section className="seller-listings" aria-labelledby="seller-listings-title">
          <div className="section-heading">
            <div>
              <p className="overline">Seller studio</p>
              <h2 id="seller-listings-title">Your listings</h2>
            </div>
            <span>{sellerProducts.length} published</span>
          </div>
          {status && <p className="form-error" role="alert">{status}</p>}
          {sellerProducts.length === 0 ? (
            <div className="state-panel"><p>You have no published listings yet.</p></div>
          ) : (
            <div className="seller-product-list">
              {sellerProducts.map((product) => (
                <div className="seller-product-row" key={product._id}>
                  <ProductCard product={product} />
                  <div className="seller-product-actions">
                    <Link className="button button-secondary" to={`/seller/products/${product._id}/edit`}>Edit</Link>
                    <button className="button button-danger" disabled={deletingId === product._id} onClick={() => handleDelete(product)}>
                      {deletingId === product._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      <Link className="text-link" to="/products">
        Return to the catalogue →
      </Link>
    </main>
  );
}
