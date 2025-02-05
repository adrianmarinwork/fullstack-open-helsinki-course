import { useState } from 'react';

import blogService from '../services/blogs';

const Blog = ({ blog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
  };

  const toggleDetailsVisible = function (event) {
    event.preventDefault();
    setVisible(!visible);
  };

  if (!visible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={toggleDetailsVisible} style={{ marginLeft: '5px' }}>
            Show Details
          </button>
        </div>
      </div>
    );
  }

  const increaseBlogLikes = async function (event) {
    event.preventDefault();

    const blogWithLikesUpdated = blog;
    blogWithLikesUpdated.likes += 1;

    const blogUpdated = await blogService.updateBlog(blogWithLikesUpdated);
    setLikes(blogUpdated.likes);
  };

  const isUserCreatorOfBlog = user?.username === blog?.user?.username;

  return (
    <div style={blogStyle} className="blog">
      <div>
        <span>{blog.title}</span>
        <button onClick={toggleDetailsVisible} style={{ marginLeft: '5px' }}>
          Hide Details
        </button>
      </div>
      <span className="urlSpan">{blog.url}</span>
      <div>
        <span>Likes: {likes}</span>
        <button onClick={increaseBlogLikes} style={{ marginLeft: '5px' }}>
          Like
        </button>
      </div>
      <span>{blog.author}</span>
      {isUserCreatorOfBlog ? (
        <div>
          <button onClick={(event) => deleteBlog(event, blog)}>Delete</button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Blog;
