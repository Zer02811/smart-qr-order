const mongoose = require('mongoose');

/**
 * Schema cho món ăn / đồ uống trong menu
 * - name: Tên món (bắt buộc)
 * - price: Giá tiền VND (bắt buộc, >= 0)
 * - image: URL ảnh minh họa
 * - category: Phân loại món (bắt buộc)
 * - description: Mô tả chi tiết
 * - isAvailable: Trạng thái còn phục vụ hay không
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên món ăn là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên món không được vượt quá 100 ký tự'],
    },
    price: {
      type: Number,
      required: [true, 'Giá món ăn là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Danh mục là bắt buộc'],
      enum: {
        values: ['Đồ uống', 'Đồ ăn vặt'],
        message: 'Danh mục không hợp lệ: {VALUE}',
      },
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

// Index theo category để tối ưu query lọc theo danh mục
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
