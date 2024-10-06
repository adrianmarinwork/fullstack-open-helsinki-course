function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  if (!blogs.length) {
    return 0;
  }

  if (blogs.length === 1) {
    return blogs[0].likes;
  }

  return blogs.reduce((previous, current) => previous + current.likes, 0);
}

function favoriteBlog(blogs) {
  if (!blogs.length) {
    return null;
  }

  if (blogs.length === 1) {
    const favoriteBlog = blogs[0];
    return {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes,
    };
  }

  const blogsSortedByLikes = blogs.sort(
    (blog1, blog2) => blog2.likes - blog1.likes
  );
  const favoriteBlog = blogsSortedByLikes[0];
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
}

function mostBlogs(blogs) {
  const authorsAndBlogs = [];

  blogs.forEach((blog) => {
    const author = blog.author;
    const authorInArray = authorsAndBlogs.find(
      (element) => element.author === author
    );

    if (authorInArray) {
      authorInArray.blogs += 1;
    } else {
      authorsAndBlogs.push({ author, blogs: 1 });
    }
  });

  const authorsAndBlogsSorted = authorsAndBlogs.sort(
    (auth1, auth2) => auth2.blogs - auth1.blogs
  );

  return authorsAndBlogsSorted[0];
}

function mostLikes(blogs) {
  const authorsAndLikes = [];

  blogs.forEach((blog) => {
    const author = blog.author;
    const authorInArray = authorsAndLikes.find(
      (element) => element.author === author
    );

    if (authorInArray) {
      authorInArray.likes += blog.likes;
    } else {
      authorsAndLikes.push({ author, likes: blog.likes });
    }
  });

  const authorsAndLikesSorted = authorsAndLikes.sort(
    (auth1, auth2) => auth2.likes - auth1.likes
  );

  return authorsAndLikesSorted[0];
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
