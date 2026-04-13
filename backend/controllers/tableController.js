const Table = require('../models/Table');

/**
 * @desc    Lấy tất cả bàn
 * @route   GET /api/tables
 * @access  Public (menu cần kiểm tra bàn hợp lệ)
 */
const getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo bàn mới
 * @route   POST /api/tables
 * @access  Protected (Admin)
 */
const createTable = async (req, res, next) => {
  try {
    const { number, name, seats } = req.body;

    // Kiểm tra trùng số bàn
    const existing = await Table.findOne({ number });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Bàn số ${number} đã tồn tại`,
      });
    }

    const table = await Table.create({
      number,
      name: name || `Bàn ${number}`,
      seats: seats || 4,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bàn thành công',
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật thông tin bàn
 * @route   PUT /api/tables/:id
 * @access  Protected (Admin)
 */
const updateTable = async (req, res, next) => {
  try {
    const { name, seats, isActive } = req.body;

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { name, seats, isActive },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật bàn thành công',
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa bàn
 * @route   DELETE /api/tables/:id
 * @access  Protected (Admin)
 */
const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bàn',
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa bàn ${table.number}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTables, createTable, updateTable, deleteTable };
