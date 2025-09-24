const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET all contact messages
// GET /messages?range=month&year=2025&month=7
router.get('/messages', async (req, res) => {
  try {
    const { range = 'month', year, month } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || (new Date().getMonth() + 1);
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
    const messages = await Contact.find(match).sort({ createdAt: -1 });

    // === Chart Data Grouping ===
    let chartData = [];
    if (range === 'year') {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const monthCount = {};
      messages.forEach(m => {
        const d = new Date(m.createdAt);
        const mon = d.getMonth() + 1;
        monthCount[mon] = (monthCount[mon] || 0) + 1;
      });
      chartData = months.map(mon => ({ name: `${mon}`, users: 0, messages: monthCount[mon] || 0 }));
    } else if (range === 'month') {
      const daysInMonth = new Date(y, m, 0).getDate();
      const dayCount = {};
      messages.forEach(m => {
        const d = new Date(m.createdAt);
        const day = d.getDate();
        dayCount[day] = (dayCount[day] || 0) + 1;
      });
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        users: 0,
        messages: dayCount[i + 1] || 0
      }));
    } else if (range === 'week') {
      const getWeekOfMonth = date => {
        const d = new Date(date);
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        return Math.ceil((d.getDate() + firstDay) / 7);
      };
      const weekCount = {};
      messages.forEach(m => {
        const d = new Date(m.createdAt);
        const w = getWeekOfMonth(d);
        weekCount[w] = (weekCount[w] || 0) + 1;
      });
      chartData = Array.from({ length: 6 }, (_, i) => ({
        name: `W${i + 1}`,
        users: 0,
        messages: weekCount[i + 1] || 0
      }));
    } else if (range === 'day') {
      const daysInMonth = new Date(y, m, 0).getDate();
      const dayCount = {};
      messages.forEach(m => {
        const d = new Date(m.createdAt);
        const day = d.getDate();
        dayCount[day] = (dayCount[day] || 0) + 1;
      });
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        users: 0,
        messages: dayCount[i + 1] || 0
      }));
    }

    res.json({ messages, chartData });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST mock reply to a message (not sent to customer)
router.post('/messages/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    message.reply = reply;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
