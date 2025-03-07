import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef, useContext } from 'react';

import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import NotificationContext from './contexts/NotificationContext';
import UserContext from './contexts/UserContext';

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const newBlogMutation = useMutation({
    mutationFn: blogService.saveBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const results = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  let blogs = results.data ?? [];
  blogs = blogs.sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const userObj = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET_USER', payload: userObj });
      blogService.setApiToken(userObj.token);
    }
  }, []);

  const handleLogin = async function (event) {
    event.preventDefault();

    try {
      const userApi = await loginService.login({ username, password });
      userDispatch({ type: 'SET_USER', payload: userApi });
      blogService.setApiToken(userApi.token);
      setUsername('');
      setPassword('');
      localStorage.setItem('loggedUser', JSON.stringify(userApi));
    } catch (error) {
      console.log('Error login to server: ', error);
      const notification = {
        message: 'Wrong username or password',
        isError: true,
      };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }, 5000);
  };

  const onClickLogout = function (event) {
    event.preventDefault();
    userDispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('loggedUser');
  };

  const handleNewBlog = async function (newBlogObj) {
    const blog = newBlogObj;

    try {
      newBlogMutation.mutate(blog);
      const notification = {
        message: `A new blog ${blog.title} by ${blog.author} added.`,
        isError: false,
      };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      console.log('Error adding new blog: ', error);
      const notification = {
        message: "Couldn't add new blog",
        isError: true,
      };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
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
        dispatch({ type: 'SET_NOTIFICATION', payload: notification });
      }
    } catch (error) {
      console.log('Error deleting blog: ', error);
      const notification = {
        message: "Couldn't delete blog",
        isError: true,
      };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      dispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }, 5000);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username:
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          type="text"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogFormRef = useRef();

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {user.username} logged in
        <button onClick={onClickLogout}> Logout </button>
      </div>
      <br />
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
    </div>
  );
};

export default App;
