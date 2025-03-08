import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom';

import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import NotificationContext from './contexts/NotificationContext';
import UserContext from './contexts/UserContext';
import BlogList from './components/BlogList';
import UserList from './components/UserList';
import User from './components/User';
import Blog from './components/Blog';

const Menu = ({ user, onClickLogout }) => {
  const padding = {
    paddingRight: 5,
  };

  return (
    <div>
      <Link style={padding} to="/">
        Blogs
      </Link>
      <Link style={padding} to="/users">
        Users
      </Link>
      <span style={padding}>
        {user.username} logged in
        <button onClick={onClickLogout}> Logout </button>
      </span>
    </div>
  );
};

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      userService.setApiToken(userObj.token);
    }
  }, []);

  const usersResults = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  let users = usersResults.data ?? [];

  const matchUser = useMatch('/users/:id');
  const userUrl = matchUser
    ? users.find((us) => us.id === matchUser.params.id)
    : null;

  const matchBlog = useMatch('/blogs/:id');
  const blogUrl = matchBlog
    ? blogs.find((us) => us.id === matchBlog.params.id)
    : null;

  const handleLogin = async function (event) {
    event.preventDefault();

    try {
      const userApi = await loginService.login({ username, password });
      userDispatch({ type: 'SET_USER', payload: userApi });
      blogService.setApiToken(userApi.token);
      userService.setApiToken(userApi.token);
      setUsername('');
      setPassword('');
      localStorage.setItem('loggedUser', JSON.stringify(userApi));
    } catch (error) {
      console.log('Error login to server: ', error);
      const notification = {
        message: 'Wrong username or password',
        isError: true,
      };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }

    setTimeout(() => {
      const notification = { message: '', isError: false };
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: notification });
    }, 5000);
  };

  const onClickLogout = function (event) {
    event.preventDefault();
    userDispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('loggedUser');
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
      <Menu user={user} onClickLogout={onClickLogout} />
      <h2>blogs</h2>
      <Notification notification={notification} />
      <br />

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              notificationDispatch={notificationDispatch}
            />
          }
        />
        <Route path="/users" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<User user={userUrl} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blogUrl}
              user={user}
              notificationDispatch={notificationDispatch}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
