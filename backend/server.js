/**
 * ============================================
 *  Smart QR Order - Backend Server
 * ============================================
 *  Express + Socket.io + MongoDB
 *  Xử lý API và real-time cho ứng dụng đặt món
 * ============================================
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import Routes ---
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');

// --- Khởi tạo Express App ---
const app = express();
const server = http.createServer(app);

// --- Cấu hình CORS origin ---
const corsOrigin = process.env.CLIENT_URL === '*'
  ? true // cho phép mọi origin
  : process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH'],
  },
});

// Lưu io instance vào app để controllers có thể sử dụng
app.set('io', io);

// ============================
//  Middleware
// ============================

// CORS - cho phép frontend truy cập API
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Request logger (development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============================
//  API Routes
// ============================

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart QR Order API is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================
//  Socket.io Event Handling
// ============================

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  /**
   * Staff join room
   * - Khi nhân viên mở Dashboard, client sẽ emit 'JOIN_STAFF_ROOM'
   * - Server sẽ đưa socket đó vào room 'staff-room'
   * - Mọi sự kiện NEW_ORDER sẽ chỉ gửi tới room này
   */
  socket.on('JOIN_STAFF_ROOM', () => {
    socket.join('staff-room');
    console.log(`👨‍🍳 Staff joined room: ${socket.id}`);

    // Xác nhận cho client biết đã join thành công
    socket.emit('STAFF_ROOM_JOINED', {
      message: 'Đã tham gia kênh nhân viên',
      socketId: socket.id,
    });
  });

  /**
   * Xử lý ngắt kết nối
   */
  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`);
  });

  /**
   * Xử lý lỗi socket
   */
  socket.on('error', (error) => {
    console.error(`⚠️  Socket Error [${socket.id}]:`, error.message);
  });
});

// ============================
//  Global Error Handler
// ============================

/**
 * Middleware xử lý lỗi tập trung
 * - Mongoose validation errors → 400
 * - Mongoose CastError (invalid ID) → 400
 * - Mongoose duplicate key → 400
 * - Các lỗi khác → 500
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: messages,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID không hợp lệ',
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu bị trùng lặp',
    });
  }

  // Default: Internal Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ',
  });
});

// ============================
//  404 Handler
// ============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} không tồn tại`,
  });
});

// ============================
//  Start Server
// ============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kết nối MongoDB trước khi start server
    await connectDB();

    server.listen(PORT, () => {
      console.log('');
      console.log('============================================');
      console.log('  🍽️  Smart QR Order Server');
      console.log('============================================');
      console.log(`  🚀 Server:    http://localhost:${PORT}`);
      console.log(`  📡 Socket.io: ws://localhost:${PORT}`);
      console.log(`  🌐 Client:    ${process.env.CLIENT_URL}`);
      console.log('============================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
