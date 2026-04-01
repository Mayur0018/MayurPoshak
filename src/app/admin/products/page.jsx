"use client";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaBox, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", image: null, price: "", stock: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", image: null, price: "", imageUrl: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          stock: Number(form.stock || 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || "Failed to add product");
        return;
      }
      const newProduct = await res.json();
      setProducts((prev) => [newProduct, ...prev]);
      setForm({ name: "", image: null, price: "", stock: "" });
      setShowAddForm(false);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error("Failed to add product");
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
      stock: product.stock,
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
          price: Number(editForm.price),
          stock: Number(editForm.stock),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || "Failed to update product");
        return;
      }

      const updatedProduct = await res.json();

      setProducts((prev) =>
        prev.map((item) => (item._id === editingId ? updatedProduct : item))
      );

      setEditingId(null);
      setEditForm({ name: "", image: null, price: "", imageUrl: "", stock: "" });
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", image: null, price: "", imageUrl: "", stock: "" });
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter(p => (p.stock || 0) < 10).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Inventory Management</h1>
          <div className="flex gap-4 mt-3">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                <FaBox className="text-slate-400 text-xs" />
                <span className="text-[10px] font-black uppercase tracking-widest">{products.length} Products</span>
             </div>
             <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${lowStockCount > 0 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                <FaExclamationTriangle className="text-xs" />
                <span className="text-[10px] font-black uppercase tracking-widest">{lowStockCount} Low Stock</span>
             </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input 
                type="text" 
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-black focus:border-black transition-all shadow-sm"
              />
           </div>
           <button 
             onClick={() => setShowAddForm(!showAddForm)}
             className="bg-black text-white p-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shrink-0"
           >
             <FaPlus />
           </button>
        </div>
      </div>

      {/* ADD/EDIT FORM SECTION */}
      {(showAddForm || editingId) && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl animate-in slide-in-from-top-4 duration-500">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6">
            {editingId ? "Modify Masterpiece" : "Add to Collection"}
          </h2>
          <form
            onSubmit={editingId ? handleEditSubmit : handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Identity</label>
              <input
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-black/5"
                placeholder="e.g. Royal Banarasi Silk"
                value={editingId ? editForm.name : form.name}
                onChange={(e) => editingId ? setEditForm({ ...editForm, name: e.target.value }) : setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Imagery</label>
              <input
                className="w-full p-3.5 bg-slate-50 border-none rounded-2xl text-[10px] font-bold file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white hover:file:bg-slate-800"
                type="file"
                accept="image/*"
                onChange={(e) => editingId ? setEditForm({ ...editForm, image: e.target.files[0] }) : setForm({ ...form, image: e.target.files[0] })}
                required={!editingId}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Valuation (₹)</label>
              <input
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-black/5"
                placeholder="4999"
                type="number"
                value={editingId ? editForm.price : form.price}
                onChange={(e) => editingId ? setEditForm({ ...editForm, price: e.target.value }) : setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock Level</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-black/5"
                  placeholder="25"
                  type="number"
                  value={editingId ? editForm.stock : form.stock}
                  onChange={(e) => editingId ? setEditForm({ ...editForm, stock: e.target.value }) : setForm({ ...form, stock: e.target.value })}
                  required
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-black text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition shadow-lg"
                >
                  {loading ? "..." : (editingId ? "Save" : "Add")}
                </button>
                <button
                  type="button"
                  onClick={editingId ? handleCancelEdit : () => setShowAddForm(false)}
                  className="bg-slate-100 text-slate-500 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No Masterpieces Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p._id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <FaBox className="text-4xl" />
                  </div>
                )}
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 hover:scale-110 hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Stock Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${
                  (p.stock || 0) < 10 ? 'bg-rose-500/90 text-white' : 'bg-black/60 text-white border border-white/20'
                }`}>
                  {p.stock ?? 0} In Stock
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xs font-black uppercase tracking-tight text-slate-900 group-hover:text-black transition-colors truncate">{p.name}</h2>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg font-black tracking-tighter italic">₹{Number(p.price ?? 0).toLocaleString()}</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
