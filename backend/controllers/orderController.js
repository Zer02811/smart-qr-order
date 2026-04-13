const Order = require('../models/Order');

/**
 * @desc    Tạo đơn hàng mới + emit real-time tới Staff
 * @route   POST /api/orders
 * @access  Public (Customer)
 */
const createOrder = async (req, res, next) => {
  try {
    const { tableNumber, items, paymentMethod } = req.body;

    // --- Validation ---
    if (!tableNumber) {
      return res.status(400).json({
        success: false,
        message: 'Số bàn là bắt buộc',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng phải có ít nhất 1 món',
      });
    }

    // Tính tổng tiền từ items
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới trong DB
    const order = await Order.create({
      tableNumber,
      items,
      totalAmount,
      status: 'Pending',
      paymentMethod: paymentMethod || 'cash',
    });

    // --- Real-time: Emit sự kiện NEW_ORDER tới staff room ---
    const io = req.app.get('io');
    if (io) {
      io.to('staff-room').emit('NEW_ORDER', order);
      console.log(`📡 Emitted NEW_ORDER for Table ${tableNumber} to staff-room`);
    }

    res.status(201).json({
      success: true,
      message: 'Đặt món thành công!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách đơn hàng (có thể lọc theo status)
 * @route   GET /api/orders
 * @query   ?status=Pending (optional)
 * @access  Staff
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    // Sắp xếp: đơn mới nhất lên trước
    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật trạng thái đơn hàng + emit real-time
 * @route   PATCH /api/orders/:id
 * @body    { status: 'Preparing' | 'Served' }
 * @access  Staff
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Preparing', 'Served'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Chấp nhận: ${validStatuses.join(', ')}`,
      });
    }

    // Tìm và cập nhật đơn hàng
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    // --- Real-time: Emit sự kiện ORDER_STATUS_UPDATED tới staff room ---
    const io = req.app.get('io');
    if (io) {
      io.to('staff-room').emit('ORDER_STATUS_UPDATED', order);
      console.log(`📡 Emitted ORDER_STATUS_UPDATED: Order ${order._id} → ${status}`);
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái thành "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết một đơn hàng theo ID
 * @route   GET /api/orders/:id
 * @access  Staff
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};
