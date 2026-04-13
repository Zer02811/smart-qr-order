const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware bảo vệ route - Xác thực JWT token
 * - Kiểm tra header Authorization: Bearer <token>
 * - Verify token và gắn admin info vào req.admin
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để truy cập',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm admin từ token
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    // Gắn admin vào request
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn, vui lòng đăng nhập lại',
      });
    }
    next(error);
  }
};

module.exports = { protect };
