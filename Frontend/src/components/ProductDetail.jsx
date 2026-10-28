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
      <main className="mx-auto w-[calc(100%-3rem)] max-w-304 py-18 max-sm:w-[calc(100%-2rem)] max-sm:py-12">
        <div className="grid gap-2 border border-[var(--color-rule)] p-6 text-[var(--color-error)]">
          <p>We could not open this product.</p>
          <span>{error}</span>
          <Link className="w-fit rounded border border-[var(--color-ink)] px-4 py-2 text-sm font-bold text-[var(--color-ink)]" to="/products">
            Back to catalogue
          </Link>
        </div>
      </main>
    );
  if (!product)
    return (
      <main className="mx-auto w-[calc(100%-3rem)] max-w-304 py-18 max-sm:w-[calc(100%-2rem)] max-sm:py-12">
        <div className="aspect-[4/5] animate-pulse bg-[var(--color-paper-2)]" />
      </main>
    );
  const image = product.images?.[0] || product.image?.[0];
  return (
    <main className="mx-auto w-[calc(100%-3rem)] max-w-304 py-18 max-sm:w-[calc(100%-2rem)] max-sm:py-12">
      <Link className="text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4" to="/products">
        ← Catalogue
      </Link>
      <article className="mt-5 grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-12 max-md:grid-cols-1 max-md:gap-6">
        <div className="grid aspect-[4/5] place-items-center overflow-hidden bg-[var(--color-paper-2)] text-[var(--color-muted)]">
          {image ? (
            <img className="h-full w-full object-cover" src={image} alt={product.title} />
          ) : (
            <span>Image forthcoming</span>
          )}
        </div>
        <div className="pt-4">
          <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Selected piece</p>
          <h1 className="font-[var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-.05em]">{product.title}</h1>
          <p className="my-5 text-lg font-bold">{formatPrice(product)}</p>
          <p className="max-w-144 text-lg text-[var(--color-muted)]">{product.description}</p>
          <p className="mt-12 border-t border-[var(--color-rule)] pt-4 text-sm text-[var(--color-muted)]">
            Availability and fulfilment are arranged directly by the seller.
          </p>
        </div>
      </article>
    </main>
  );
}
