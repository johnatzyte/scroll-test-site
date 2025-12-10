import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../api.js";
import Reviews from "./Reviews.jsx";

function formatPrice(product) {
  const { price, priceCurrency } = product;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: priceCurrency || "USD",
  }).format(price);
}

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchProduct(productId)
      .then((p) => setProduct(p))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <p className="muted">Loading product…</p>;
  if (error) return <p className="muted">{error}</p>;
  if (!product) return null;

  return (
    <div className="detail">
      <img src={product.image} alt={product.name} />
      <div className="detail-meta">
        <div className="badge">{product.brand}</div>
        <h2 className="title" style={{ fontSize: "1.6rem" }}>
          {product.name}
        </h2>
        <p className="muted">{product.description}</p>
        <div className="price-row">
          <span>{formatPrice(product)}</span>
          <span className="muted">{product.availability}</span>
        </div>
        <div className="chip-row">
          <span className="chip">SKU: {product.sku}</span>
          <span className="chip">Category: {product.category}</span>
          <span className="chip">Currency: {product.priceCurrency}</span>
        </div>
        <Link className="button" to="/">
          ← Back to catalog
        </Link>
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Reviews productId={productId} />
      </div>
    </div>
  );
}
