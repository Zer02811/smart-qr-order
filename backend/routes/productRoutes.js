const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getCategories,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// === Public Routes ===

// GET /api/products/categories - Lấy danh sách category (đặt trước /:id)
router.get('/categories', getCategories);

// GET /api/products/all - Lấy tất cả sản phẩm kể cả ẩn (Admin)
router.get('/all', protect, getAllProductsAdmin);

// GET /api/products - Lấy tất cả sản phẩm (chỉ available)
router.get('/', getAllProducts);

// GET /api/products/:id - Lấy chi tiết một sản phẩm
router.get('/:id', getProductById);

// === Protected Routes (Admin) ===

// POST /api/products - Tạo sản phẩm mới
router.post('/', protect, createProduct);

// PUT /api/products/:id - Cập nhật sản phẩm
router.put('/:id', protect, updateProduct);

// DELETE /api/products/:id - Xóa sản phẩm
router.delete('/:id', protect, deleteProduct);

module.exports = router;
