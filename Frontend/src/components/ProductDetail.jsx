import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import { formatPrice } from "./ProductCard.jsx";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .get(`/products/${productId}`)
      .then(({ data }) => {
        if (active) setProduct(data.data?.product);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message ||
              "This product is unavailable.",
          );
      });
    return () => {
      active = false;
    };
  }, [productId]);
  if (error)
    return (
      <main className="page-shell detail-page">
        <div className="state-panel state-panel-error">
          <p>We could not open this product.</p>
          <span>{error}</span>
          <Link className="button button-secondary" to="/products">
            Back to catalogue
          </Link>
        </div>
      </main>
    );
  if (!product)
    return (
      <main className="page-shell detail-page">
        <div className="detail-skeleton" />
      </main>
    );
  const image = product.images?.[0] || product.image?.[0];
  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/products">
        ← Catalogue
      </Link>
      <article className="product-detail">
        <div className="detail-image">
          {image ? (
            <img src={image} alt={product.title} />
          ) : (
            <span>Image forthcoming</span>
          )}
        </div>
        <div className="detail-copy">
          <p className="overline">Selected piece</p>
          <h1>{product.title}</h1>
          <p className="detail-price">{formatPrice(product)}</p>
          <p>{product.description}</p>
          <p className="detail-note">
            Availability and fulfilment are arranged directly by the seller.
          </p>
        </div>
      </article>
    </main>
  );
}
