const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} = require('../controllers/orderController');

// POST /api/orders - Tạo đơn hàng mới (Customer)
router.post('/', createOrder);

// GET /api/orders - Lấy danh sách đơn hàng (Staff)
router.get('/', getAllOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng
router.get('/:id', getOrderById);

// PATCH /api/orders/:id - Cập nhật trạng thái đơn hàng (Staff)
router.patch('/:id', updateOrderStatus);

module.exports = router;
