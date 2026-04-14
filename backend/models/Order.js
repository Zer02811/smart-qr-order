const mongoose = require('mongoose');

/**
 * Schema cho từng item trong đơn hàng
 * - Lưu snapshot thông tin món tại thời điểm đặt (tên, giá)
 *   để tránh ảnh hưởng khi menu thay đổi sau này.
 */
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng tối thiểu là 1'],
    },
    image: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
      maxlength: [200, 'Ghi chú không được vượt quá 200 ký tự'],
    },
  },
  { _id: false } // Không cần _id riêng cho sub-document
);

/**
 * Schema cho đơn hàng
 * - tableNumber: Số bàn lấy từ QR code
 * - items: Danh sách món đã đặt
 * - totalAmount: Tổng tiền đơn hàng
 * - status: Trạng thái xử lý đơn hàng
 */
const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Số bàn là bắt buộc'],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Đơn hàng phải có ít nhất 1 món',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Tổng tiền là bắt buộc'],
      min: [0, 'Tổng tiền không được âm'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Preparing', 'Served'],
        message: 'Trạng thái không hợp lệ: {VALUE}',
      },
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash', 'transfer'],
        message: 'Phương thức thanh toán không hợp lệ: {VALUE}',
      },
      default: 'cash',
    },
  },
  {
    timestamps: true, // createdAt sẽ được tự động tạo
  }
);

// Index để tối ưu query lọc theo trạng thái và sắp xếp theo thời gian
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ tableNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
