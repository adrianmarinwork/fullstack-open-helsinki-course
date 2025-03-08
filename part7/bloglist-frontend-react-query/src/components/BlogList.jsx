import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import Togglable from './Togglable';
import NewBlogForm from './NewBlogForm';
import blogService from '../services/blogs';

const BlogList = ({ blogs, notificationDispatch }) => {
  const blogFormRef = useRef();
  const queryClient = useQueryClient();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
  };

  const newBlogMutation = useMutation({
    mutationFn: blogService.saveBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const handleNewBlog = async function (newBlogObj) {
    const blog = newBlogObj;

    try {
      newBlogMutation.mutate(blog);
      const notification = {
        message: `A new blog ${blog.title} by ${blog.author} added.`,
        isError: false,
      };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      console.log('Error adding new blog: ', error);
      const notification = {
        message: "Couldn't add new blog",
        isError: true,
      };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }, 5000);
  };

  return (
    <>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlogForm createBlog={handleNewBlog} />
      </Togglable>
      <br />
      {blogs.map((blog) => (
        <div style={blogStyle} key={blog.id} className="blog">
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </>
  );
};

export default BlogList;
