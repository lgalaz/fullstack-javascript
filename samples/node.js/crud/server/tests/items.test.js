import request from "supertest";
import app from "../src/app.js";
import sequelize from "../src/db.js";
import Item from "../src/models/item.js";

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Item.destroy({ where: {} });
});

test("creates an item", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({ name: "Notebook", description: "Grid paper" });

  expect(response.status).toBe(201);
  expect(response.body.name).toBe("Notebook");
});

test("lists items", async () => {
  await Item.create({ name: "Pen", description: "Black ink" });

  const response = await request(app).get("/api/items");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
});

test("updates an item", async () => {
  const item = await Item.create({ name: "Draft", description: "Old" });

  const response = await request(app)
    .put(`/api/items/${item.id}`)
    .send({ name: "Final", description: "New" });

  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Final");
});

test("deletes an item", async () => {
  const item = await Item.create({ name: "Trash", description: "Gone" });

  const response = await request(app).delete(`/api/items/${item.id}`);

  expect(response.status).toBe(204);
});
