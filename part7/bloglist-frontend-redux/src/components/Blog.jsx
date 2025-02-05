import { useState } from 'react';

const Blog = ({ blog, user, deleteBlog, likeBlog }) => {
  const [visible, setVisible] = useState(false);

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
        <span>Likes: {blog.likes}</span>
        <button
          onClick={(event) => likeBlog(event, blog)}
          style={{ marginLeft: '5px' }}
        >
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
