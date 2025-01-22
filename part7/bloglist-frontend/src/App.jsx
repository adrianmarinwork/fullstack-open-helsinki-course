import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isErrorMessage, setIsErroMessage] = useState(false);

  useEffect(() => {
    blogService.getAll().then(function (blogs) {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const userObj = JSON.parse(loggedUserJSON);
      setUser(userObj);
      blogService.setApiToken(userObj.token);
    }
  }, []);

  const handleLogin = async function (event) {
    event.preventDefault();

    try {
      const userApi = await loginService.login({ username, password });
      setUser(userApi);
      blogService.setApiToken(userApi.token);
      setUsername('');
      setPassword('');
      localStorage.setItem('loggedUser', JSON.stringify(userApi));
    } catch (error) {
      console.log('Error login to server: ', error);
      setNotificationMessage('Wrong username or password');
      setIsErroMessage(true);
    }

    setTimeout(() => {
      setNotificationMessage('');
      setIsErroMessage(false);
    }, 5000);
  };

  const onClickLogout = function (event) {
    event.preventDefault();
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  const handleNewBlog = async function (newBlogObj) {
    const blog = newBlogObj;

    try {
      const blogApi = await blogService.saveBlog(blog);
      setBlogs(blogs.concat(blogApi));
      setNotificationMessage(
        `A new blog ${blog.title} by ${blog.author} added.`
      );
      setIsErroMessage(false);

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      console.log('Error adding new blog: ', error);
      setNotificationMessage("Couldn't add new blog");
      setIsErroMessage(true);
    }

    setTimeout(() => {
      setNotificationMessage('');
      setIsErroMessage(false);
    }, 5000);
  };

  const handleDeleteBlog = async function (event, blogToDelete) {
    try {
      const doWeHaveToDelete = window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      );

      if (doWeHaveToDelete) {
        await blogService.deleteBlog(blogToDelete.id);

        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
        setNotificationMessage('Blog deleted successfully');
        setIsErroMessage(false);
      }
    } catch (error) {
      console.log('Error deleting blog: ', error);
      setNotificationMessage("Couldn't delete blog");
      setIsErroMessage(true);
    }

    setTimeout(() => {
      setNotificationMessage('');
      setIsErroMessage(false);
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
        <Notification message={notificationMessage} isError={isErrorMessage} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} isError={isErrorMessage} />
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
