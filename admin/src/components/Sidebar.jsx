
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const menu = [
  { name: 'Dashboard', to: '/dashboard', icon: <HomeIcon className="h-5 w-5 mr-3" /> },
  { name: 'Users', to: '/users', icon: <UsersIcon className="h-5 w-5 mr-3" /> },
  { name: 'Messages', to: '/messages', icon: <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" /> },
  { name: 'Profile', to: '/profile', icon: <UserCircleIcon className="h-5 w-5 mr-3" /> },
];

const Sidebar = () => (
  <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-60 min-h-screen p-6 flex flex-col shadow-lg">
    <div className="flex items-center gap-2 mb-10">
      <span className="bg-indigo-500 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">A</span>
      <span className="text-2xl font-extrabold tracking-wide">Admin</span>
    </div>
    <nav className="flex flex-col gap-2 flex-1">
      {menu.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isActive ? 'bg-indigo-600 text-white shadow' : 'hover:bg-gray-700 hover:text-indigo-200'
            }`
          }
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
    <div className="mt-10 text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} Admin Panel</div>
  </aside>
);

export default Sidebar;
