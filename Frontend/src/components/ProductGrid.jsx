import { useProducts } from "../context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid() {
  const { products, isLoading, error, loadProducts } = useProducts();
  return <section className="catalogue" aria-labelledby="catalogue-title"><div className="catalogue-heading"><div><p className="overline">Published collection</p><h2 id="catalogue-title">The current edit</h2></div><button className="text-button" onClick={loadProducts}>Refresh catalogue</button></div>{isLoading && <div className="product-grid" aria-label="Loading catalogue">{Array.from({ length: 6 }, (_, i) => <div className="product-skeleton" key={i} />)}</div>}{error && <div className="state-panel state-panel-error"><p>We could not load the catalogue.</p><span>{error}</span><button className="button button-secondary" onClick={loadProducts}>Try again</button></div>}{!isLoading && !error && products.length === 0 && <div className="state-panel"><p>The catalogue is waiting for its first published piece.</p><span>Products become visible here once a seller publishes them.</span></div>}{!isLoading && !error && products.length > 0 && <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}</section>;
}
