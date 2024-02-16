const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (password.length < 3) {
    return response.status(400).json({ error: "password must be at least 3 characters long" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => response
  .json(await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 })));

module.exports = usersRouter;
