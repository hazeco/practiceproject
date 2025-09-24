// PATCH /api/admin/profile/avatar - อัปเดต avatar ของ admin
exports.updateAvatar = async (req, res) => {
  try {
    const adminId = req.user._id; // ต้องมี middleware auth
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'No avatar provided' });
    const user = await User.findById(adminId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
    user.profile = user.profile || {};
    user.profile.avatar = avatar;
    await user.save();
    res.json({ success: true, avatar });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update avatar', error: error.message });
  }
};
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// GET /api/admin/users - ดึงรายชื่อ users ทั้งหมด (ตัวอย่าง)
exports.getUsers = async (req, res) => {
  try {
    const { range = 'month', year, month } = req.query;
    // year, month เป็น string ต้องแปลงเป็น int
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || (new Date().getMonth() + 1);
    // Filter users by year/month if needed
    let match = {};
    if (range === 'year') {
      match = {
        createdAt: {
          $gte: new Date(`${y}-01-01T00:00:00.000Z`),
          $lt: new Date(`${y + 1}-01-01T00:00:00.000Z`)
        }
      };
    } else if (range === 'month' || range === 'week' || range === 'day') {
      match = {
        createdAt: {
          $gte: new Date(`${y}-${String(m).padStart(2, '0')}-01T00:00:00.000Z`),
          $lt: new Date(`${y}-${String(m + 1).padStart(2, '0')}-01T00:00:00.000Z`)
        }
      };
    }
    const users = await User.find(match, {
      _id: 1,
      username: 1,
      email: 1,
      role: 1,
      createdAt: 1,
      'profile.fullName': 1,
      'profile.avatar': 1
    });

    // === Chart Data Grouping ===
    let chartData = [];
    if (range === 'year') {
      // group by month in year
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const monthCount = {};
      users.forEach(u => {
        const d = new Date(u.createdAt);
        const mon = d.getMonth() + 1;
        monthCount[mon] = (monthCount[mon] || 0) + 1;
      });
      chartData = months.map(mon => ({ name: `${mon}`, users: monthCount[mon] || 0, messages: 0 }));
    } else if (range === 'month') {
      // group by day in month
      const daysInMonth = new Date(y, m, 0).getDate();
      const dayCount = {};
      users.forEach(u => {
        const d = new Date(u.createdAt);
        const day = d.getDate();
        dayCount[day] = (dayCount[day] || 0) + 1;
      });
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        users: dayCount[i + 1] || 0,
        messages: 0
      }));
    } else if (range === 'week') {
      // group by week number in month
      const getWeekOfMonth = date => {
        const d = new Date(date);
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        return Math.ceil((d.getDate() + firstDay) / 7);
      };
      const weekCount = {};
      users.forEach(u => {
        const d = new Date(u.createdAt);
        const w = getWeekOfMonth(d);
        weekCount[w] = (weekCount[w] || 0) + 1;
      });
      chartData = Array.from({ length: 6 }, (_, i) => ({
        name: `W${i + 1}`,
        users: weekCount[i + 1] || 0,
        messages: 0
      }));
    } else if (range === 'day') {
      // group by day (show 1-31, but filter by month)
      const daysInMonth = new Date(y, m, 0).getDate();
      const dayCount = {};
      users.forEach(u => {
        const d = new Date(u.createdAt);
        const day = d.getDate();
        dayCount[day] = (dayCount[day] || 0) + 1;
      });
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        users: dayCount[i + 1] || 0,
        messages: 0
      }));
    }

    res.json({ users, chartData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (admin not found)' });
    }
    if (!user.password) {
      return res.status(401).json({ message: 'Admin does not have a password set.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await user.save();
    res.json({
      message: 'Login successful',
      token, // เปลี่ยนชื่อ key ให้ client รับถูกต้อง
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
