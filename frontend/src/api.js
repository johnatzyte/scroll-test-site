const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050/api";

export async function fetchProducts(page = 1, pageSize = 6, category = "") {
  let url = `${API_BASE}/products?page=${page}&page_size=${pageSize}`;
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`);
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) {
    throw new Error(`Failed to load categories (${res.status})`);
  }
  return res.json();
}

export async function fetchProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`);
  if (!res.ok) {
    throw new Error(`Product ${productId} not found`);
  }
  return res.json();
}

export async function fetchReviews(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
  if (!res.ok) {
    throw new Error(`Failed to load reviews (${res.status})`);
  }
  return res.json();
}

export async function postReview(productId, reviewData) {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) {
    throw new Error(`Failed to post review (${res.status})`);
  }
  return res.json();
}
