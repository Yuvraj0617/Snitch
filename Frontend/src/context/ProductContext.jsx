import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import client from "../api/client.js";

const ProductContext = createContext(null);
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await client.get("/products");
      setProducts(data.data?.products ?? []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Products are unavailable right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  const updateProduct = useCallback(async (productId, product) => {
    const { data } = await client.put(`/products/${productId}`, product);
    const updatedProduct = data.data?.product ?? data.data;
    if (updatedProduct?._id) {
      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct._id === updatedProduct._id
            ? updatedProduct
            : currentProduct,
        ),
      );
    }
    return data;
  }, []);
  const deleteProduct = useCallback(async (productId) => {
    const { data } = await client.delete(`/products/${productId}`);
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== productId),
    );
    return data;
  }, []);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        loadProducts,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used inside ProductProvider");
  return context;
}
