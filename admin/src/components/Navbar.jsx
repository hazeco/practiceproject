

import { useAuth } from '../context/AuthContext';
import { useAvatar } from '../context/AvatarContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { logout } = useAuth();
  const { avatar } = useAvatar();
  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
      <div className="font-extrabold text-xl tracking-wide text-gray-800">Admin Panel</div>
      <div className="flex items-center gap-6">
        <NotificationDropdown />
        <a href="/profile" className="flex items-center gap-3 group cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition">
          <img src={avatar} alt="avatar" className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow object-cover" />
          <span className="font-semibold text-gray-700 group-hover:text-indigo-600">Admin</span>
        </a>
        <button onClick={logout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
