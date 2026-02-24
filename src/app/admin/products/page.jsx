"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", image: null, price: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", image: null, price: "", imageUrl: "" });
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
  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return "";

    const data = new FormData();
    data.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Image upload failed");
    }
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
      const imageLink = await handleImageUpload(form.image);
      if (!imageLink) {
        alert("Image upload failed");
        return;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          image: imageLink,
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.message || "Failed to add product");
        return;
      }
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
     EDIT PRODUCT
  ========================= */
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      image: null,
      price: product.price,
      imageUrl: product.image,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageLink = editForm.imageUrl;

      // Only upload new image if one was selected
      if (editForm.image) {
        imageLink = await handleImageUpload(editForm.image);
      }

      const res = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          image: imageLink,
          price: editForm.price,
        }),
      });

      const updatedProduct = await res.json();

      // ✅ Update product in list
      setProducts((prev) =>
        prev.map((item) => (item._id === editingId ? updatedProduct : item))
      );

      setEditingId(null);
      setEditForm({ name: "", image: null, price: "", imageUrl: "" });
    } catch (err) {
      alert("Failed to update product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", image: null, price: "", imageUrl: "" });
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

      {/* EDIT PRODUCT FORM */}
      {editingId && (
        <div className="bg-blue-50 p-6 mb-6 rounded-lg border border-blue-300">
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col gap-2 max-w-sm"
          >
            <input
              className="p-2 border"
              placeholder="Product Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />

            <input
              className="p-2 border"
              type="file"
              accept="image/*"
              onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
            />
            {editForm.imageUrl && (
              <p className="text-sm text-gray-600">
                Current image: {editForm.imageUrl.split("/").pop()}
              </p>
            )}

            <input
              className="p-2 border"
              placeholder="Price"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              required
            />

            <div className="flex gap-2">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-500 text-white p-2 disabled:opacity-60 flex-1"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white p-2 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
          {products.map((p, idx) => (
            <div key={p._id || p.id || `${p.name}-${p.price}-${idx}`} className="border p-4 relative">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-96 object-cover mb-2"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 mb-2" />
              )}
              <h2 className="font-medium">{p.name}</h2>
              <p>₹{Number(p.price ?? 0)}</p>

              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => handleEditClick(p)}
                  className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition"
                  title="Edit Product"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition"
                  title="Delete Product"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
