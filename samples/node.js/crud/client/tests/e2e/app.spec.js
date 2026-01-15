import { test, expect } from "@playwright/test";

test("adds an item", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("e.g. Field notes").fill("Clip");
  await page.getByPlaceholder("Optional details").fill("Silver");
  await page.getByRole("button", { name: "Add item" }).click();

  await expect(page.getByText("Clip")).toBeVisible();
});
