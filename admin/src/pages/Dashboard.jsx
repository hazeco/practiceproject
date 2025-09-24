
import React, { useEffect, useState } from 'react';
import { UsersIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchUsers, fetchMessages } from '../services/dashboard';
import ChartRangeSelector from '../components/ChartRangeSelector';
import ChartDatePicker from '../components/ChartDatePicker';
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('month'); // 'day' | 'week' | 'month' | 'year'
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  // ฟังก์ชันโหลดข้อมูล (reuse ได้)
  // โหลดข้อมูลแบบเลือกได้ว่าจะโชว์ loading หรือไม่
  const load = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const params = { range, year };
    if (range !== 'year') params.month = month + 1; // 1-based month
    const [usersData, messagesData] = await Promise.all([
      fetchUsers(params),
      fetchMessages(params),
    ]);
    setUsers(Array.isArray(usersData.users) ? usersData.users : []);
    // รวม chartData จาก users และ messages
    let chart = [];
    if (Array.isArray(usersData.chartData) && Array.isArray(messagesData.chartData)) {
      // merge users/messages chartData by name
      const map = new Map();
      usersData.chartData.forEach(d => map.set(d.name, { ...d }));
      messagesData.chartData.forEach(d => {
        if (map.has(d.name)) {
          map.get(d.name).messages = d.messages;
        } else {
          map.set(d.name, { users: 0, ...d });
        }
      });
      chart = Array.from(map.values());
    } else if (Array.isArray(usersData.chartData)) {
      chart = usersData.chartData;
    } else if (Array.isArray(messagesData.chartData)) {
      chart = messagesData.chartData;
    }
    setChartData(chart);
    setMessages(Array.isArray(messagesData.messages) ? messagesData.messages : []);
    if (showLoading) setLoading(false);
  };

  // โหลดข้อมูลเมื่อ range/year/month เปลี่ยน (โชว์ loading)
  useEffect(() => {
    load(true);
  }, [range, year, month]);

  // Auto update (polling ทุก 10 วินาที, ไม่โชว์ loading)
  useEffect(() => {
    const interval = setInterval(() => {
      load(false);
    }, 10000); // 10 วินาที
    return () => clearInterval(interval);
  }, [range, year, month]);

  const adminCount = Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0;
  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      icon: <UsersIcon className="h-8 w-8 text-indigo-500" />,
      color: 'bg-indigo-50',
    },
    {
      name: 'Messages',
      value: messages.length,
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50',
    },
    {
      name: 'Admins',
      value: adminCount,
      icon: <UserCircleIcon className="h-8 w-8 text-pink-500" />,
      color: 'bg-pink-50',
    },
  ];

  // chartData ถูกแยก state แล้ว

  if (loading) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`rounded-xl shadow-md p-6 flex items-center gap-5 ${stat.color} select-none focus:outline-none focus:ring-0 active:outline-none active:ring-0`}
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
            tabIndex={-1}
            onMouseDown={e => e.preventDefault()}
            onFocus={e => e.target.style.outline = 'none'}
            onClick={e => e.target.blur()}
            // ปิด outline/focus ring และป้องกัน browser outline ทุกกรณี
          >
            <div>{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-500 font-medium">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
          <h2 className="text-xl font-bold text-gray-700">Statistics Overview</h2>
          <div className="flex gap-2 items-center">
            <ChartRangeSelector value={range} onChange={setRange} />
            <ChartDatePicker
              range={range}
              year={year}
              month={month}
              onYearChange={setYear}
              onMonthChange={setMonth}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} name="Users" />
            <Line type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={3} name="Messages" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Latest Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.slice(-5).reverse().map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{u.username}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3 capitalize">{u.role}</td>
                  <td className="py-2 px-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Latest Messages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Message</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(-5).reverse().map(m => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{m.name}</td>
                  <td className="py-2 px-3">{m.email}</td>
                  <td className="py-2 px-3 max-w-xs truncate">{m.message}</td>
                  <td className="py-2 px-3">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ...existing code...
export default Dashboard;

