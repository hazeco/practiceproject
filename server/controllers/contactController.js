const Contact = require('../models/Contact');

// POST /api/contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'ส่งข้อความสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
};
