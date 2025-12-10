import { Link } from "react-router-dom";

function formatPrice(product) {
  const { price, priceCurrency } = product;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: priceCurrency || "USD",
  }).format(price);
}

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="badge">{product.brand}</div>
      <h3 className="title">{product.name}</h3>
      <p className="muted">{product.description}</p>
      <div className="price-row">
        <span>{formatPrice(product)}</span>
        <span className="muted">{product.availability}</span>
      </div>
      <Link className="button" to={`/products/${product.id}`}>
        View details →
      </Link>
    </div>
  );
}
