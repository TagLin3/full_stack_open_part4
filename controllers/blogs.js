const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { body } = request;

  const { user } = request;
  if (!user) {
    return response.status(401).json({ error: "token invalid or missing" });
  }
  const userFromDb = await User.findOne({ username: user.username });

  const blog = new Blog(body);
  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).end();
  }
  blog.likes = blog.likes ?? 0;
  userFromDb.blogs = userFromDb.blogs.concat(blog.id);
  blog.user = userFromDb.id;
  await userFromDb.save();
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { user } = request;
  if (!user) {
    return response.status(401).json({ error: "token invalid or missing" });
  }
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete.user) {
    return response.status(204).end();
  }
  if (user.id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).json({
      error: "The user associated with this token does not have permission to delete this blog",
    });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const {
    title, author, url, likes,
  } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
    title, author, url, likes,
  }, { new: true, runValidators: true, context: "query" });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
