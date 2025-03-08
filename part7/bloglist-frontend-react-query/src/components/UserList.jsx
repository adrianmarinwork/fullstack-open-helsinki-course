import { useQuery } from '@tanstack/react-query';

import userService from '../services/users';

const UserList = () => {
  const usersResults = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  let users = usersResults.data ?? [];
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
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserList;
