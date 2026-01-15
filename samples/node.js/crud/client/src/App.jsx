import React from "react";
import { useItems } from "./hooks/useItems.js";

export default function App() {
  const {
    items,
    form,
    editingId,
    status,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useItems();

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Inventory Desk</p>
        <h1>Track items with a clean, lightweight workflow.</h1>
        <p className="subhead">
          Create, update, and manage your catalog in seconds. This is a minimal CRUD
          SPA with a polished feel.
        </p>
      </header>

      <main className="grid">
        <section className="panel">
          <div className="panel-header">
            <h2>{editingId ? "Edit item" : "New item"}</h2>
            {editingId && (
              <button className="ghost" type="button" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Field notes"
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details"
                rows="4"
              />
            </label>
            <button className="primary" type="submit">
              {editingId ? "Update item" : "Add item"}
            </button>
          </form>
          {status.type !== "idle" && (
            <p className={`status status-${status.type}`}>{status.message}</p>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Inventory</h2>
            <span className="count">{items.length} items</span>
          </div>
          <div className="list">
            {items.length === 0 && status.type !== "loading" ? (
              <div className="empty">
                <p>No items yet. Add the first one to get started.</p>
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="card">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description || "No description provided."}</p>
                  </div>
                  <div className="actions">
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
