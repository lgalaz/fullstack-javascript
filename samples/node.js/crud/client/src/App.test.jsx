import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { createItem, fetchItems } from "./api.js";
import { vi } from "vitest";

vi.mock("./api.js", () => ({
  fetchItems: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn()
}));

test("renders inventory list", async () => {
  fetchItems.mockResolvedValue([{ id: 1, name: "Marker", description: "Blue" }]);

  render(<App />);

  expect(await screen.findByText("Marker")).toBeInTheDocument();
});

test("creates an item", async () => {
  fetchItems.mockResolvedValue([]);
  createItem.mockResolvedValue({ id: 1, name: "Notebook", description: "Lined" });

  render(<App />);

  const nameInput = await screen.findByPlaceholderText("e.g. Field notes");
  await userEvent.type(nameInput, "Notebook");
  await userEvent.type(screen.getByPlaceholderText("Optional details"), "Lined");
  await userEvent.click(screen.getByRole("button", { name: "Add item" }));

  expect(await screen.findByText("Notebook")).toBeInTheDocument();
});
