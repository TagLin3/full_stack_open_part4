const listHelper = require("../utils/list_helper");

const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const singleBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

describe("Total of likes", () => {
  test("for multiple blogs is the total amount of likes on those blogs", () => {
    expect(listHelper.totalLikes(multipleBlogs)).toBe(36);
  });
  test("for an array with one blog is the amount of likes on that blog", () => {
    expect(listHelper.totalLikes(singleBlog)).toBe(5);
  });
  test("for an empty array is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });
});

describe("Most liked blog", () => {
  test("of multiple blogs is blog with most likes correctly formatted", () => {
    expect(listHelper.favoriteBlog(multipleBlogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
  test("of single blog is that blog itself correctly formatted", () => {
    expect(listHelper.favoriteBlog(singleBlog)).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test("of empty array is an empty object", () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });
});

describe("Author with the most blogs", () => {
  test("for multiple blogs is a correctly formatted author with the most blogs ", () => {
    expect(listHelper.mostBlogs(multipleBlogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
  test("for a single blog is the correctly formatted author of that blog", () => {
    expect(listHelper.mostBlogs(singleBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });
  test("for an empty array is an empty object", () => {
    expect(listHelper.mostBlogs([])).toEqual({});
  });
});

describe("Author with the most likes", () => {
  test("for multiple blog is a correctly formatted author with the most likes", () => {
    expect(listHelper.mostLikes(multipleBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
  test("for a single blog is the correctly formatted author of that blog", () => {
    expect(listHelper.mostLikes(singleBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test("for an empty array is an empty object", () => {
    expect(listHelper.mostLikes([])).toEqual({});
  });
});
