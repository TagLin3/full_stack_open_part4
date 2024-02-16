const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helpers");
const Blog = require("../models/blog");

let token = null;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const blogsToAdd = helper.initialBlogs;
  const mongooseObjs = blogsToAdd.map((blog) => new Blog(blog));
  const promiseArray = mongooseObjs.map((obj) => obj.save());
  await Promise.all(promiseArray);
  const user = new User({
    username: "root",
    name: "superuser",
    passwordHash: await bcrypt.hash("pass", 10),
  });
  await user.save();
  const loginRequest = await api.post("/api/login").send({
    username: "root",
    password: "pass",
  });
  token = loginRequest.body.token;
});

test("getting all blogs gets correct amount of blogs.", async () => {
  const blogs = await api.get("/api/blogs").expect(200);
  expect(blogs.body).toHaveLength(helper.initialBlogs.length);
});

test("id property is called id (and not _id)", async () => {
  const blogs = await api.get("/api/blogs");
  expect(blogs.body[0].id).toBeDefined();
});

test("adding a new blog works", async () => {
  const blogToSend = {
    title: "testBlog",
    author: "testBlogger",
    likes: 1,
    url: "http://localhost:7777",
  };

  await api.post("/api/blogs")
    .set({ Authorization: `Bearer ${token}` })
    .send(blogToSend).expect(201);
  const blogsAtEnd = await helper.getBlogsInDatabase();
  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
  expect(lastBlog.name).toEqual(blogToSend.name);
  expect(lastBlog.author).toEqual(blogToSend.author);
  expect(lastBlog.likes).toEqual(blogToSend.likes);
  expect(lastBlog.url).toEqual(blogToSend.url);
});

test("likes default to 0 if undefined", async () => {
  const blogToSend = {
    title: "testBlog",
    author: "testBlogger",
    url: "http://localhost:7777",
  };
  await api.post("/api/blogs")
    .set({ Authorization: `Bearer ${token}` })
    .send(blogToSend).expect(201);
  const blogsAtEnd = await helper.getBlogsInDatabase();
  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
  expect(lastBlog.likes).toEqual(0);
});

test("missing url returns 400 bad request", async () => {
  const blogToSend = {
    title: "testBlog",
    author: "testBlogger",
  };
  await api.post("/api/blogs")
    .set({ Authorization: `Bearer ${token}` })
    .send(blogToSend).expect(400);
});

test("missing title returns 400 bad request", async () => {
  const blogToSend = {
    author: "testBlogger",
    url: "http://localhost:7777",
  };
  await api.post("/api/blogs")
    .set({ Authorization: `Bearer ${token}` })
    .send(blogToSend).expect(400);
});

test("missing authorization header returns status code 401", async () => {
  const blogToSend = {
    title: "testBlog",
    author: "testBlogger",
    url: "http://localhost:7777",
  };
  await api.post("/api/blogs")
    .send(blogToSend).expect(401);
});

test("deletion of a blog post works and returns status code 204", async () => {
  const blogsAtStart = await helper.getBlogsInDatabase();
  await Blog.findByIdAndDelete(blogsAtStart[0].id);
  const blogsAtEnd = await helper.getBlogsInDatabase();
  expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);
});

test("updating a blogs likes works", async () => {
  const blogsAtStart = await helper.getBlogsInDatabase();
  const blogToUpdate = blogsAtStart[0];
  const updatedBlog = { ...blogToUpdate };
  updatedBlog.likes += 1;
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog);
  const blogsAtEnd = await helper.getBlogsInDatabase();
  expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1);
});

afterAll(() => {
  mongoose.connection.close();
});
