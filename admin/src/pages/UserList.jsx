import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users');
        setUsers(res.data.users || []);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-5 border-b font-semibold text-gray-700 text-left">ID</th>
              <th className="py-3 px-5 border-b font-semibold text-gray-700 text-left">Name</th>
              <th className="py-3 px-5 border-b font-semibold text-gray-700 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-5 border-b">{index + 1}</td>
                <td className="py-2 px-5 border-b">{user.username || user.name || '-'}</td>
                <td className="py-2 px-5 border-b">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
