import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import Togglable from './Togglable';
import NewBlogForm from './NewBlogForm';
import Blog from './Blog';
import blogService from '../services/blogs';

const BlogList = ({ blogs, user, notificationDispatch }) => {
  const blogFormRef = useRef();
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: blogService.saveBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
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

  return (
    <>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlogForm createBlog={handleNewBlog} />
      </Togglable>
      <br />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          deleteBlog={handleDeleteBlog}
        />
      ))}
    </>
  );
};

export default BlogList;
