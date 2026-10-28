import { useProducts } from "../context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid() {
  const { products, isLoading, error, loadProducts } = useProducts();
  return (
    <section className="mt-12" aria-labelledby="catalogue-title">
      <div className="mb-4 flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--color-muted)]">Published collection</p>
          <h2 id="catalogue-title" className="font-[var(--font-display)] text-4xl font-normal tracking-[-.04em]">The current edit</h2>
        </div>
        <button className="text-sm font-bold text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)] underline-offset-4" onClick={loadProducts}>
          Refresh catalogue
        </button>
      </div>
      {isLoading && (
        <div className="grid grid-cols-3 border-l border-t border-[var(--color-rule)] max-md:grid-cols-2 max-sm:grid-cols-1" aria-label="Loading catalogue">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="min-h-92 animate-pulse border-b border-r border-[var(--color-rule)] bg-[var(--color-paper-2)]" key={i} />
          ))}
        </div>
      )}
      {error && (
        <div className="grid gap-2 border border-[var(--color-rule)] p-6 text-[var(--color-error)]">
          <p>We could not load the catalogue.</p>
          <span>{error}</span>
          <button className="w-fit rounded border border-[var(--color-ink)] px-4 py-2 text-sm font-bold text-[var(--color-ink)]" onClick={loadProducts}>
            Try again
          </button>
        </div>
      )}
      {!isLoading && !error && products.length === 0 && (
        <div className="grid gap-2 border border-[var(--color-rule)] p-6">
          <p>The catalogue is waiting for its first published piece.</p>
          <span>
            Products become visible here once a seller publishes them.
          </span>
        </div>
      )}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-3 border-l border-t border-[var(--color-rule)] max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
