import { useState, useEffect, useRef } from 'react';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { addBlogPost, initializeBlogPosts } from './reducers/blogPostReducer';
import BlogPostList from './components/BlogPostList';
import { loginUser, logoutUser, updateUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(initializeBlogPosts());
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const userObj = JSON.parse(loggedUserJSON);
      dispatch(updateUser(userObj));
      blogService.setApiToken(userObj.token);
    }
  }, []);

  const handleLogin = async function (event) {
    event.preventDefault();

    try {
      const userApi = await dispatch(loginUser({ username, password }));
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
      dispatch(setNotification(notification, 5000));
    }
  };

  const onClickLogout = function (event) {
    event.preventDefault();
    dispatch(logoutUser());
    localStorage.removeItem('loggedUser');
  };

  const handleNewBlog = function (newBlogObj) {
    const blog = newBlogObj;

    try {
      dispatch(addBlogPost(blog));

      const notification = {
        message: `A new blog ${blog.title} by ${blog.author} added.`,
        isError: false,
      };
      dispatch(setNotification(notification, 5000));

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      console.log('Error adding new blog: ', error);

      const notification = { message: "Couldn't add new blog", isError: true };
      dispatch(setNotification(notification, 5000));
    }
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
        <Notification />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.username} logged in
        <button onClick={onClickLogout}> Logout </button>
      </div>
      <br />
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlogForm createBlog={handleNewBlog} />
      </Togglable>
      <br />
      <BlogPostList />
    </div>
  );
};

export default App;
