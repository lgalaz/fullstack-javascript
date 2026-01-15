const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Request failed");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const fetchItems = async () => {
  const response = await fetch(`${API_BASE}/api/items`);
  return handleResponse(response);
};

export const createItem = async (payload) => {
  const response = await fetch(`${API_BASE}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

export const updateItem = async (id, payload) => {
  const response = await fetch(`${API_BASE}/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

export const deleteItem = async (id) => {
  const response = await fetch(`${API_BASE}/api/items/${id}`, {
    method: "DELETE"
  });
  return handleResponse(response);
};
