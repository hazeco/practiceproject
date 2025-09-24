// Temporary script to hash admin password and print the result
const bcrypt = require('bcryptjs');

const password = 'admin123'; // เปลี่ยนรหัสผ่านที่ต้องการได้ที่นี่

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('Hashed password:', hash);
  process.exit(0);
});
