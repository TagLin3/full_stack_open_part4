const lodash = require("lodash");

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogWithMostLikes = blogs
    .reduce((currentHighest, blog) => (blog.likes > currentHighest.likes ? blog : currentHighest));
  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  };
};

const mostBlogs = (blogs) => (blogs.length === 0 ? {}
  : lodash.uniq(blogs.map((blog) => blog.author))
    .map((author) => ({
      author,
      blogs: blogs
        .filter((blog) => blog.author === author).length,
    }))
    .reduce((currentHighest, author) => (author.blogs > currentHighest.blogs ? author : currentHighest)));

const mostLikes = (blogs) => (blogs.length === 0 ? {}
  : lodash.uniq(blogs.map((blog) => blog.author))
    .map((author) => ({
      author,
      likes: blogs
        .filter((blog) => blog.author === author)
        .reduce((sum, blog) => sum + blog.likes, 0),
    }))
    .reduce((currentHighest, author) => (author.likes > currentHighest.likes ? author : currentHighest)));

module.exports = {
  totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
