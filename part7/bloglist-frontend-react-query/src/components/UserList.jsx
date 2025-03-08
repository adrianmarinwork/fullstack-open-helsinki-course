import { Link } from 'react-router-dom';

const UserList = ({ users }) => {
  console.log('users: ', users);

  if (!users.length) {
    return <></>;
  }

  return (
    <>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserList;
