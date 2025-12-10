import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProducts } from "../api.js";
import ProductCard from "./ProductCard.jsx";
import CategoryFilter from "./CategoryFilter.jsx";

const PAGE_SIZE = 6;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchProducts(page, PAGE_SIZE, category)
      .then((res) => {
        setProducts((prev) => {
          if (page === 1) return res.items;
          // Filter out duplicates
          const newItems = res.items.filter(
            (item) => !prev.some((p) => p.id === item.id)
          );
          return [...prev, ...newItems];
        });
        setHasMore(res.page < res.total_pages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setProducts([]);
    setHasMore(true);
  };

  return (
    <div>
      <CategoryFilter
        selectedCategory={category}
        onSelectCategory={handleCategoryChange}
      />

      {error && <p className="muted">{error}</p>}

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={lastElementRef} style={{ height: "20px", margin: "20px 0", textAlign: "center" }}>
        {loading && <p className="muted">Loading more products…</p>}
        {!hasMore && products.length > 0 && (
          <p className="muted">You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
}
