const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Tạo JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Đăng nhập Admin
 * @route   POST /api/auth/login
 * @body    { username, password }
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập username và mật khẩu',
      });
    }

    // Tìm admin (bao gồm password field)
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc mật khẩu không đúng',
      });
    }

    // So sánh password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc mật khẩu không đúng',
      });
    }

    // Tạo token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thông tin admin hiện tại (verify token)
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.admin._id,
        username: req.admin.username,
        name: req.admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
