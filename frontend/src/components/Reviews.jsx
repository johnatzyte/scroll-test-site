import { useEffect, useState } from "react";
import { fetchReviews } from "../api.js";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = () => {
    setLoading(true);
    fetchReviews(productId)
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading && reviews.length === 0) return <p className="muted">Loading reviews…</p>;
  if (error) return <p className="muted">Error loading reviews: {error}</p>;

  return (
    <div className="reviews-section" style={{ marginTop: "40px" }}>
      <h3>Reviews ({reviews.length})</h3>
      
      <div className="review-list" style={{ marginBottom: "30px" }}>
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card" style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <strong>{review.author}</strong>
                <span style={{ color: "gold" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              <p style={{ margin: 0 }}>{review.text}</p>
              <small className="muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
