const express = require('express');
const router = express.Router();
const {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/tables - Lấy tất cả bàn (Public)
router.get('/', getAllTables);

// POST /api/tables - Tạo bàn mới (Admin only)
router.post('/', protect, createTable);

// PUT /api/tables/:id - Cập nhật bàn (Admin only)
router.put('/:id', protect, updateTable);

// DELETE /api/tables/:id - Xóa bàn (Admin only)
router.delete('/:id', protect, deleteTable);

module.exports = router;
