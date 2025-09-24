import axios from '../utils/axios';


// เพิ่มรองรับช่วงเวลา (range: 'day' | 'week' | 'month')
// params: { range, year, month }
export async function fetchUsers(params = { range: 'month', year: new Date().getFullYear(), month: new Date().getMonth() + 1 }) {
  const res = await axios.get('/users', { params });
  return res.data;
}

export async function fetchMessages(params = { range: 'month', year: new Date().getFullYear(), month: new Date().getMonth() + 1 }) {
  const res = await axios.get('/messages', { params });
  return res.data;
}
