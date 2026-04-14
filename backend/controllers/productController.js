const Product = require('../models/Product');

/**
 * @desc    Lấy tất cả sản phẩm (có thể lọc theo category)
 * @route   GET /api/products
 * @query   ?category=Món chính (optional)
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;

    // Trả về tất cả sản phẩm (bao gồm hết hàng) để frontend hiển thị trạng thái
    const filter = {};

    // Nếu có query category, thêm vào filter
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết một sản phẩm theo ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách tất cả category có sẵn
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    // Sử dụng distinct để lấy danh sách category không trùng lặp
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy tất cả sản phẩm (bao gồm cả ẩn - dành cho Admin)
 * @route   GET /api/products/all
 * @access  Protected (Admin)
 */
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo sản phẩm mới
 * @route   POST /api/products
 * @access  Protected (Admin)
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo món ăn thành công',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật sản phẩm
 * @route   PUT /api/products/:id
 * @access  Protected (Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa sản phẩm
 * @route   DELETE /api/products/:id
 * @access  Protected (Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa "${product.name}"`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
