"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", image: null, price: "" });
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  /* =========================
     IMAGE UPLOAD
  ========================= */
  const handleImageUpload = async () => {
    if (!form.image) return "";

    const data = new FormData();
    data.append("file", form.image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    return result.url;
  };

  /* =========================
     ADD PRODUCT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageLink = await handleImageUpload();

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          image: imageLink,
          price: form.price,
        }),
      });

      const newProduct = await res.json();

      // ✅ backend must return created product with _id
      setProducts((prev) => [...prev, newProduct]);

      setForm({ name: "", image: null, price: "" });
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE PRODUCT (FIXED)
  ========================= */
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // ✅ correct way
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } else {
      alert("Failed to delete product");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* ADD PRODUCT FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mb-6 max-w-sm"
      >
        <input
          className="p-2 border"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="p-2 border"
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          required
        />

        <input
          className="p-2 border"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white p-2 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* PRODUCTS GRID */}
      {products.length === 0 ? (
        <p>No Products Found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4 relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-96 object-cover mb-2"
              />
              <h2 className="font-medium">{p.name}</h2>
              <p>₹{p.price}</p>

              <button
                onClick={() => handleDelete(p._id)}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition"
                title="Delete Product"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
