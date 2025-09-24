import axios from '../utils/axios';

export async function updateAdminAvatar(avatar) {
  const token = localStorage.getItem('admin_token');
  const res = await axios.patch('/admin/profile/avatar', { avatar }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.avatar;
}
