import { useSelector, useDispatch } from 'react-redux';

import Blog from './Blog';
import { setNotification } from '../reducers/notificationReducer';
import { deletePost, updateBlogPost } from '../reducers/blogPostReducer';

const BlogPostList = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogPosts);
  const user = useSelector((state) => state.user);

  const handleDeleteBlog = async function (event, blogToDelete) {
    try {
      const doWeHaveToDelete = window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      );

      if (doWeHaveToDelete) {
        dispatch(deletePost(blogToDelete));

        const notification = {
          message: 'Blog deleted successfully',
          isError: false,
        };
        dispatch(setNotification(notification, 5000));
      }
    } catch (error) {
      console.log('Error deleting blog: ', error);

      const notification = { message: "Couldn't delete blog", isError: true };
      dispatch(setNotification(notification, 5000));
    }
  };

  const increaseBlogLikes = function (event, blog) {
    event.preventDefault();
    dispatch(updateBlogPost(blog));
  };

  return (
    <>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          likeBlog={increaseBlogLikes}
          deleteBlog={handleDeleteBlog}
        />
      ))}
    </>
  );
};

export default BlogPostList;
