# Full Stack Authentication Project

## คำอธิบาย
โปรเจกต์นี้เป็นแอปพลิเคชัน Full Stack ที่พัฒนาด้วย React (Vite) และ Express.js พร้อมระบบยืนยันตัวตนแบบ JWT

## การติดตั้ง

### การตั้งค่าฐานข้อมูล MongoDB
1. สร้างบัญชีที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. สร้าง Cluster ใหม่
3. สร้าง Database User และ Database Password
4. อนุญาต IP Address ที่จะเข้าถึงฐานข้อมูล
5. คัดลอก Connection String และแก้ไขไฟล์ .env

### การติดตั้ง Backend
1. เข้าไปที่โฟลเดอร์ server:
```bash
cd server
```

2. ติดตั้ง Dependencies:
```bash
npm install
```

3. สร้างไฟล์ .env จาก .env.example และกำหนดค่าต่างๆ:
```bash
cp .env.example .env
```

4. แก้ไขไฟล์ .env และใส่ค่าต่างๆ:
```

```

5. รัน Server ในโหมด Development:
```bash
npm run dev
```

### การติดตั้ง Frontend
1. เข้าไปที่โฟลเดอร์ client:
```bash
cd client
```

2. ติดตั้ง Dependencies:
```bash
npm install
```

3. รัน Frontend ในโหมด Development:
```bash
npm run dev
```

## การ Deploy

### การ Deploy Frontend บน Vercel
1. สร้างบัญชีที่ [Vercel](https://vercel.com)
2. เชื่อมต่อ GitHub Repository
3. Import โปรเจกต์และเลือกโฟลเดอร์ client
4. กำหนดค่า Environment Variables ถ้าจำเป็น
5. กด Deploy

### การ Deploy Backend บน Render หรือ AWS EC2

#### Render
1. สร้างบัญชีที่ [Render](https://render.com)
2. สร้าง Web Service ใหม่
3. เชื่อมต่อ GitHub Repository
4. เลือกโฟลเดอร์ server
5. ตั้งค่า Environment Variables
6. กด Deploy

#### AWS EC2
1. สร้าง EC2 Instance
2. ติดตั้ง Node.js และ npm
3. Clone Repository
4. ติดตั้ง Dependencies
5. ตั้งค่า Environment Variables
6. รัน Server ด้วย PM2 หรือ similar process manager:
```bash
npm install -g pm2
pm2 start index.js
```

## โครงสร้างโปรเจกต์

### Frontend (client)
```
src/
├── components/     # React Components
├── pages/         # หน้าต่างๆ
├── context/       # React Context
├── hooks/         # Custom Hooks
├── services/      # API Services
└── utils/         # Utility Functions
```

### Backend (server)
```
├── controllers/   # Route Controllers
├── middleware/    # Custom Middleware
├── models/        # Mongoose Models
└── routes/        # API Routes
```

## API Endpoints

### Authentication
- POST /api/auth/register - ลงทะเบียนผู้ใช้ใหม่
- POST /api/auth/login - เข้าสู่ระบบ
- POST /api/auth/reset-password - ขอรีเซ็ตรหัสผ่าน
- POST /api/auth/reset-password/:token - ยืนยันรหัสผ่านใหม่

### User
- GET /api/user/me - ดูข้อมูลผู้ใช้ปัจจุบัน

## การพัฒนาเพิ่มเติม
- เพิ่มระบบยืนยันอีเมล (Email Verification)
- เพิ่มระบบ Login ด้วย Social Media (Google, Facebook, ฯลฯ)
- เพิ่มระบบ Refresh Token สำหรับการต่ออายุ Token
- เพิ่มระบบจัดการโปรไฟล์ผู้ใช้ (Profile Management)
- เพิ่มระบบ Role และ Permission สำหรับการกำหนดสิทธิ์ผู้ใช้
