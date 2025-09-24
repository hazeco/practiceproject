import axios from './axios';

export async function fetchMessageNotifications() {
  // ดึง message ทั้งหมดจาก backend (รองรับทั้ง array และ object)
  const res = await axios.get('/messages');
  const messages = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.messages) ? res.data.messages : []);
  return messages.map(msg => ({
    id: msg._id,
    type: 'message',
    title: `New message from ${msg.name}`,
    content: msg.message,
    createdAt: msg.createdAt,
    read: !!msg.read,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.name)}&background=4f46e5&color=fff`,
    link: `/messages#${msg._id}`,
    messageId: msg._id,
  }));
}
