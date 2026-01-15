import { renderHook, act, waitFor } from "@testing-library/react";
import { useItems } from "./useItems.js";
import { createItem, fetchItems } from "../api.js";
import { vi } from "vitest";

vi.mock("../api.js", () => ({
  fetchItems: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}));

test("loads items on mount", async () => {
  fetchItems.mockResolvedValue([{ id: 1, name: "Brush", description: "Soft" }]);

  const { result } = renderHook(() => useItems());

  await waitFor(() => {
    expect(result.current.items).toHaveLength(1);
  });
});

test("submits new item", async () => {
  fetchItems.mockResolvedValue([]);
  createItem.mockResolvedValue({ id: 2, name: "Tape", description: "Clear" });

  const { result } = renderHook(() => useItems());

  act(() => {
    result.current.handleChange({ target: { name: "name", value: "Tape" } });
    result.current.handleChange({ target: { name: "description", value: "Clear" } });
  });

  await act(async () => {
    await result.current.handleSubmit({ preventDefault: () => {} });
  });

  expect(result.current.items).toHaveLength(1);
});
