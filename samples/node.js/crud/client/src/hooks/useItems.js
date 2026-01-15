import { useCallback, useEffect, useState } from "react";
import { createItem, deleteItem, fetchItems, updateItem } from "../api.js";

const emptyForm = { name: "", description: "" };

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const loadItems = useCallback(async () => {
    setStatus({ type: "loading", message: "Loading items..." });
    try {
      const data = await fetchItems();
      setItems(data);
      setStatus({ type: "idle", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "saving", message: "Saving changes..." });

    try {
      if (editingId) {
        const updated = await updateItem(editingId, form);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } else {
        const created = await createItem(form);
        setItems((prev) => [created, ...prev]);
      }
      resetForm();
      setStatus({ type: "success", message: "Saved." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description || "" });
  };

  const handleDelete = async (id) => {
    setStatus({ type: "saving", message: "Removing item..." });
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setStatus({ type: "success", message: "Removed." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return {
    items,
    form,
    editingId,
    status,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};
