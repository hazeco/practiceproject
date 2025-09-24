import React, { useEffect, useState, useRef } from 'react';
import axios from '../utils/axios';
import { useLocation } from 'react-router-dom';


const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState({});
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const messageRefs = useRef({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/messages');
        // รองรับทั้ง array และ object (messages)
        const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.messages) ? res.data.messages : []);
        // ดึง reply จาก localStorage ถ้ามี
        const replyMap = JSON.parse(localStorage.getItem('admin_message_replies') || '{}');
        const merged = arr.map(m => ({ ...m, reply: replyMap[m._id] || m.reply }));
        setMessages(merged);
      } catch (err) {
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Scroll to message if navigated from notification
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        if (messageRefs.current[id]) {
          messageRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [location, messages]);

  const handleReply = async (id) => {
    try {
      // mock: บันทึก reply ลง localStorage
      const replyMap = JSON.parse(localStorage.getItem('admin_message_replies') || '{}');
      replyMap[id] = reply[id] || '';
      localStorage.setItem('admin_message_replies', JSON.stringify(replyMap));
      setMessages(messages.map(m => m._id === id ? { ...m, reply: reply[id] || '' } : m));
      setSuccess('ตอบกลับสำเร็จ (mock)');
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      setError('ตอบกลับไม่สำเร็จ');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ข้อความจากลูกค้า</h1>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="space-y-4">
        {messages.length === 0 && <div>ไม่มีข้อความ</div>}
        {messages.map(msg => (
          <div
            key={msg._id}
            ref={el => (messageRefs.current[msg._id] = el)}
            className={`flex gap-4 border rounded-xl p-5 bg-white shadow transition-all group ${location.hash === '#' + msg._id ? 'ring-2 ring-indigo-400' : ''}`}
          >
            <div className="flex-shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.name)}&background=4f46e5&color=fff`} alt="avatar" className="w-14 h-14 rounded-full border-2 border-indigo-200 shadow" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-1">
                <span className="font-bold text-lg text-gray-800">{msg.name}</span>
                <span className="text-xs text-gray-400">{msg.email}</span>
                <span className="text-xs text-gray-400 ml-auto">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-2 text-gray-700">{msg.message}</div>
              <div className="mb-2 text-sm text-gray-500"><b>Reply:</b> {msg.reply || <span className="text-gray-400">ยังไม่ได้ตอบกลับ</span>}</div>
              <div className="flex gap-2 mt-2">
                <input
                  className="border px-2 py-1 rounded flex-1"
                  type="text"
                  placeholder="ตอบกลับ (mock)"
                  value={reply[msg._id] || ''}
                  onChange={e => setReply({ ...reply, [msg._id]: e.target.value })}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => handleReply(msg._id)}
                >ตอบกลับ</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
