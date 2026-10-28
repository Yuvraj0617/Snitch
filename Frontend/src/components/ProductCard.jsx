import { Link } from "react-router-dom";

export function formatPrice(product) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: product.price?.currency || "INR", maximumFractionDigits: 0 }).format(product.price?.amount || 0);
}

export default function ProductCard({ product }) {
  const image = product.images?.[0] || product.image?.[0];
  return <article className="product-card"><Link to={`/products/${product._id}`} className="product-image-link" aria-label={`View ${product.title}`}><div className="product-image">{image ? <img src={image} alt={product.title} loading="lazy" /> : <span>Image forthcoming</span>}</div></Link><div className="product-card-body"><div><h3><Link to={`/products/${product._id}`}>{product.title}</Link></h3><p>{product.description}</p></div><div className="product-card-meta"><span>{formatPrice(product)}</span><Link to={`/products/${product._id}`}>View <span aria-hidden="true">→</span></Link></div></div></article>;
}
