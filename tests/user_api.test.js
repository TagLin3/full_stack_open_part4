const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User({
    username: "root",
    name: "superuser",
    passwordHash: "$2a$10$fzofGtUMlWZaecTU8FQ2gODv.1niKyGOl1f3qP7Vd1LHyYPOMAIVu",
  });
  await user.save();
});

test("Too short username is responded to with the appropriate status code and error message", async () => {
  const response = await api.post("/api/users").send({
    username: "a",
    name: "asdf",
    password: "pass",
  }).expect(400);
  expect(response.body).toEqual({ error: "User validation failed: username: Path `username` (`a`) is shorter than the minimum allowed length (3)." });
});

test("Too short password is responded to with the appropriate status code and error message", async () => {
  const response = await api.post("/api/users").send({
    username: "asdf",
    name: "asdf",
    password: "p",
  }).expect(400);
  expect(response.body).toEqual({ error: "password must be at least 3 characters long" });
});

test("Non-unique username is responed to with the appropriate status code and error message", async () => {
  const response = await api.post("/api/users").send({
    username: "root",
    name: "superuser",
    password: "pass",
  }).expect(400);
  expect(response.body).toEqual({ error: "User validation failed: username: Error, expected `username` to be unique. Value: `root`" });
});

afterAll(() => mongoose.connection.close());
