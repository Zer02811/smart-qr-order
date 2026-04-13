const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema cho tài khoản Admin
 * - username: Tên đăng nhập (unique)
 * - password: Mật khẩu (bcrypt hash)
 * - name: Tên hiển thị
 */
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username là bắt buộc'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username tối thiểu 3 ký tự'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
      select: false, // Không trả về password khi query
    },
    name: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware: Hash mật khẩu trước khi lưu
 */
adminSchema.pre('save', async function (next) {
  // Chỉ hash khi password thay đổi
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method: So sánh mật khẩu nhập vào với hash trong DB
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
