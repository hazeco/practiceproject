import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValid = form.name && form.email && form.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    try {
      // ส่งข้อมูลไป backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
      toast.success('ข้อความของคุณถูกส่งเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false, // ไม่หยุดเมื่อ mouse hover
        draggable: true,
        progress: undefined,
      });
      setForm({ name: '', email: '', message: '' });
      setTouched({});
      setSubmitted(false);
    } catch {
      toast.error('ขออภัย เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false, // ไม่หยุดเมื่อ mouse hover
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="contact-container">
      <h2>ติดต่อเรา</h2>
      <p className="contact-intro">
        มีคำถาม ข้อเสนอแนะ หรืออยากแบ่งปันประสบการณ์เที่ยวเชียงใหม่?
        ส่งข้อความถึงเราได้เลย!
      </p>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          placeholder="ชื่อของคุณ"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={
            (submitted || touched.name) && !form.name ? 'input-error' : ''
          }
        />
        {(submitted || touched.name) && !form.name && (
          <div className="error-text">กรุณากรอกชื่อของคุณ</div>
        )}
        <input
          type="email"
          name="email"
          placeholder="อีเมลของคุณ"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={
            (submitted || touched.email) && !form.email ? 'input-error' : ''
          }
        />
        {(submitted || touched.email) && !form.email && (
          <div className="error-text">กรุณากรอกอีเมลของคุณ</div>
        )}
        <textarea
          name="message"
          placeholder="ข้อความของคุณ"
          rows="6"
          required
          style={{ resize: 'none' }}
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={
            (submitted || touched.message) && !form.message ? 'input-error' : ''
          }
        ></textarea>
        {(submitted || touched.message) && !form.message && (
          <div className="error-text">กรุณากรอกข้อความของคุณ</div>
        )}
        <button type="submit">ส่งข้อความ</button>
      </form>
    </div>
  );
}

export default Contact;