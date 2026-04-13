const mongoose = require('mongoose');

/**
 * Schema cho Bàn ăn
 * - number: Số bàn (unique, hiển thị trên QR)
 * - name: Tên gợi nhớ (VD: "Bàn VIP 1", "Bàn ngoài sân")
 * - seats: Số ghế
 * - isActive: Bàn có đang hoạt động không
 */
const tableSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Số bàn là bắt buộc'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    seats: {
      type: Number,
      default: 4,
      min: [1, 'Số ghế tối thiểu là 1'],
      max: [20, 'Số ghế tối đa là 20'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Table', tableSchema);
