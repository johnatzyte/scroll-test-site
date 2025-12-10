import json
import math
from pathlib import Path
from typing import Dict, List

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_DIR = Path(__file__).resolve().parent / "data"
if not DATA_DIR.exists():
    DATA_DIR = Path(__file__).resolve().parent.parent / "data"

PRODUCTS_FILE = DATA_DIR / "products.json"
REVIEWS_FILE = DATA_DIR / "reviews.json"


def load_json(path: Path) -> List[Dict]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: List[Dict]):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


PRODUCTS = load_json(PRODUCTS_FILE)
PRODUCT_INDEX = {p["id"]: p for p in PRODUCTS}


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/products")
def list_products():
    try:
        page = int(request.args.get("page", 1))
        page_size = int(request.args.get("page_size", 6))
        category = request.args.get("category")
    except ValueError:
        return jsonify({"error": "page and page_size must be integers"}), 400

    if page < 1 or page_size < 1:
        return jsonify({"error": "page and page_size must be positive"}), 400

    filtered_products = PRODUCTS
    if category:
        filtered_products = [p for p in PRODUCTS if p.get("category") == category]

    total_items = len(filtered_products)
    total_pages = max(1, math.ceil(total_items / page_size))
    start = (page - 1) * page_size
    end = start + page_size

    items = filtered_products[start:end]
    return jsonify(
        {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
        }
    )


@app.route("/api/categories")
def list_categories():
    categories = sorted(list(set(p.get("category") for p in PRODUCTS if p.get("category"))))
    return jsonify(categories)


@app.route("/api/products/<product_id>")
def get_product(product_id: str):
    product = PRODUCT_INDEX.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product)


@app.route("/api/products/<product_id>/reviews", methods=["GET"])
def get_product_reviews(product_id: str):
    all_reviews = load_json(REVIEWS_FILE)
    product_reviews = [r for r in all_reviews if r.get("productId") == product_id]
    # Sort by date descending
    product_reviews.sort(key=lambda x: x.get("date", ""), reverse=True)
    return jsonify(product_reviews)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
