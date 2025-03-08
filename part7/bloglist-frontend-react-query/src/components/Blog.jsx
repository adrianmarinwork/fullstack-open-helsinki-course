import { useState } from 'react';

import blogService from '../services/blogs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Blog = ({ blog, user, notificationDispatch }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
  };

  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  if (!blog) {
    return null;
  }

  const increaseBlogLikes = async function (event) {
    event.preventDefault();

    const blogWithLikesUpdated = blog;
    blogWithLikesUpdated.likes += 1;

    updateBlogMutation.mutate(blogWithLikesUpdated);
  };

  const handleDeleteBlog = async function (event, blogToDelete) {
    try {
      const doWeHaveToDelete = window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      );

      if (doWeHaveToDelete) {
        deleteBlogMutation.mutate(blogToDelete.id);

        const notification = {
          message: 'Blog deleted successfully',
          isError: false,
        };
        notificationDispatch({
          type: 'SET_NOTIFICATION',
          payload: notification,
        });
      }

      navigate('/');
    } catch (error) {
      console.log('Error deleting blog: ', error);
      const notification = {
        message: "Couldn't delete blog",
        isError: true,
      };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }, 5000);
  };

  const handleAddComment = async function (event, blog) {
    const blogWithCommentsUpdated = blog;
    blogWithCommentsUpdated.comments.push(comment);
    updateBlogMutation.mutate(blogWithCommentsUpdated);
    setComment('');
  };

  const isUserCreatorOfBlog = user?.username === blog?.user?.username;

  console.log('blog: ', blog);

  return (
    <div style={blogStyle} className="blog">
      <div>
        <h2>{blog.title}</h2>
      </div>
      <span className="urlSpan">{blog.url}</span>
      <div>
        <span>Likes: {blog.likes}</span>
        <button onClick={increaseBlogLikes} style={{ marginLeft: '5px' }}>
          Like
        </button>
      </div>
      <span>{blog.author}</span>
      {isUserCreatorOfBlog ? (
        <div>
          <button onClick={(event) => handleDeleteBlog(event, blog)}>
            Delete
          </button>
        </div>
      ) : (
        ''
      )}
      <h3>Comments</h3>
      <div>
        <input
          type="text"
          value={comment}
          name="Comment"
          onChange={(event) => setComment(event.target.value)}
        ></input>
        <button onClick={(event) => handleAddComment(event, blog)}>
          Add Comment
        </button>
      </div>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
