import React, { useRef, useState } from 'react';
import { useAvatar } from '../context/AvatarContext';
import { updateAdminAvatar } from '../services/admin';

const Profile = () => {
  const { avatar, setAvatar } = useAvatar();
  const [preview, setPreview] = useState(avatar);
  const [success, setSuccess] = useState('');
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateAdminAvatar(preview);
      setAvatar(preview);
      setSuccess('เปลี่ยนรูปโปรไฟล์สำเร็จ!');
      setTimeout(() => setSuccess(''), 1500);
    } catch (e) {
      setSuccess('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <img src={preview} alt="avatar" className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-lg object-cover" />
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition"
          onClick={() => fileInput.current.click()}
        >เลือกรูปใหม่</button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
          onClick={handleSave}
          disabled={preview === avatar}
        >บันทึก</button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </div>
    </div>
  );
};

export default Profile;
