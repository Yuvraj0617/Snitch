import { Link } from "react-router-dom";

export function formatPrice(product) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price?.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price?.amount || 0);
}

export default function ProductCard({ product }) {
  const image = product.images?.[0] || product.image?.[0];
  return (
    <article className="min-w-0 border-b border-r border-[var(--color-rule)] bg-[var(--color-paper)]">
      <Link
        to={`/products/${product._id}`}
        className="block"
        aria-label={`View ${product.title}`}
      >
        <div className="grid aspect-[4/5] place-items-center overflow-hidden bg-[var(--color-paper-2)] text-sm text-[var(--color-muted)]">
          {image ? (
            <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" src={image} alt={product.title} loading="lazy" />
          ) : (
            <span>Image forthcoming</span>
          )}
        </div>
      </Link>
      <div className="flex min-h-40 flex-col justify-between gap-5 p-4">
        <div>
          <h3 className="mb-2 font-[var(--font-display)] text-2xl font-normal leading-none">
            <Link to={`/products/${product._id}`}>{product.title}</Link>
          </h3>
          <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm font-bold">
          <span>{formatPrice(product)}</span>
          <Link className="text-[var(--color-accent-deep)]" to={`/products/${product._id}`}>
            View <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
