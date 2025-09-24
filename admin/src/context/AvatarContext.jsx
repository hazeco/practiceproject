import React, { createContext, useContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(localStorage.getItem('admin_avatar') || 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff');

  useEffect(() => {
    localStorage.setItem('admin_avatar', avatar);
  }, [avatar]);

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
