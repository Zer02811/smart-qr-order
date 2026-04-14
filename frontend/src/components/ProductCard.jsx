import { useCart } from '../context/CartContext';

/**
 * ProductCard - Card hiển thị một món ăn/đồ uống
 * Pink pastel theme cho Tiệm Dạo 5CE
 * Hỗ trợ hiển thị trạng thái hết hàng
 */
export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();

  // Kiểm tra số lượng hiện tại trong giỏ
  const cartItem = items.find((item) => item.product === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = !product.isAvailable;

  /**
   * Format giá tiền VND
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className={`glass-card overflow-hidden animate-fade-in-up transition-all duration-300 relative ${
      isOutOfStock ? 'opacity-75' : 'hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-300/20'
    }`}>
      {/* Overlay hết hàng */}
      {isOutOfStock && (
        <div className="out-of-stock-overlay">
          <span className="out-of-stock-badge">🚫 Hết hàng</span>
        </div>
      )}

      {/* Ảnh món ăn */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock ? 'hover:scale-110' : 'grayscale'}`}
          loading="lazy"
        />
        {/* Badge số lượng trong giỏ */}
        {quantityInCart > 0 && !isOutOfStock && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse-glow">
            {quantityInCart}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/* Thông tin */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 className="text-base font-semibold text-[#4A3347] mb-1.5 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-[#9B7D93] mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Giá */}
        <span className="text-lg font-bold gradient-text">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Nút thêm - nút tròn góc dưới phải */}
      {!isOutOfStock ? (
        <button
          onClick={() => addToCart(product)}
          style={{ width: '42px', height: '42px', bottom: '16px', right: '16px' }}
          className="absolute rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-400/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/40 active:scale-90 cursor-pointer"
          id={`add-to-cart-${product._id}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      ) : (
        <div
          style={{ bottom: '16px', right: '16px', padding: '8px 14px' }}
          className="absolute rounded-full bg-gray-200 text-gray-500 text-xs font-semibold"
        >
          Hết
        </div>
      )}
    </div>
  );
}
