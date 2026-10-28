import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client.js";
import { useProducts } from "../context/ProductContext.jsx";

export default function SellerProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const [values, setValues] = useState({ title: "", description: "", amount: "", currency: "INR", size: "M", stock: "", images: [] });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(productId));

  useEffect(() => {
    if (!productId) return;
    let active = true;
    api.get(`/products/${productId}`)
      .then(({ data }) => {
        const product = data.data?.product;
        if (!product) throw new Error("Product not found");
        if (active) {
          setValues({
            title: product.title || "",
            description: product.description || "",
            amount: product.price?.amount ?? "",
            currency: product.price?.currency || "INR",
            size: product.sizes?.[0]?.size || "M",
            stock: product.sizes?.[0]?.stock ?? "",
            images: [],
          });
        }
      })
      .catch((requestError) => {
        if (active) setStatus(requestError.response?.data?.message || "The product could not be loaded.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSaving(true);
    try {
      const body = productId
        ? {
            title: values.title,
            description: values.description,
            price: { amount: Number(values.amount), currency: values.currency },
            sizes: [{ size: values.size, stock: Number(values.stock) }],
          }
        : new FormData();
      if (!productId) {
        body.append("title", values.title);
        body.append("description", values.description);
        body.append("price[amount]", values.amount);
        body.append("price[currency]", values.currency);
        body.append("sizes[0][size]", values.size);
        body.append("sizes[0][stock]", values.stock);
        values.images.forEach((image) => body.append("images", image));
      }
      const response = productId
        ? await updateProduct(productId, body)
        : await api.post("/products", body);
      navigate(`/products/${response.data.data?.product?._id || productId}`);
    } catch (requestError) {
      setStatus(requestError.response?.data?.message || "The product could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <main className="page-shell studio-page"><p>Loading listing…</p></main>;
  return <main className="page-shell studio-page"><Link className="back-link" to="/account">← Account</Link><form className="studio-form" onSubmit={submit}><p className="overline">Seller studio</p><h1>{productId ? "Refine a listing." : "Add to the catalogue."}</h1><Field label="Product name" value={values.title} onChange={(title) => setValues({ ...values, title })} /><label className="field"><span>Description</span><textarea required value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} /></label><div className="field-pair"><Field label="Price" type="number" value={values.amount} onChange={(amount) => setValues({ ...values, amount })} /><label className="field"><span>Currency</span><select value={values.currency} onChange={(event) => setValues({ ...values, currency: event.target.value })}><option>INR</option><option>USD</option></select></label></div><div className="field-pair"><label className="field"><span>Size</span><select value={values.size} onChange={(event) => setValues({ ...values, size: event.target.value })}>{["XS", "S", "M", "L", "XL", "XXL"].map((size) => <option key={size}>{size}</option>)}</select></label><Field label="Stock" type="number" value={values.stock} onChange={(stock) => setValues({ ...values, stock })} /></div>{!productId && <label className="field"><span>Images</span><input required type="file" accept="image/*" multiple onChange={(event) => setValues({ ...values, images: Array.from(event.target.files || []).slice(0, 5) })} /><small>Up to five images, 5 MB each.</small></label>}{status && <p className="form-error" role="alert">{status}</p>}<button className="button button-primary" disabled={isSaving}>{isSaving ? "Saving…" : "Save listing"}</button></form></main>;
}

function Field({ label, type = "text", value, onChange }) {
  return <label className="field"><span>{label}</span><input required type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
