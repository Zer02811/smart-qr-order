const mongoose = require('mongoose');

/**
 * Kết nối tới MongoDB
 * - Sử dụng connection string từ biến môi trường
 * - Tự động retry khi kết nối thất bại
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8.x tự động sử dụng các option tối ưu
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Thoát process nếu không kết nối được DB
    process.exit(1);
  }
};

// Lắng nghe sự kiện disconnect để log cảnh báo
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Error: ${err.message}`);
});

module.exports = connectDB;
