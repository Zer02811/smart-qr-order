import { useCart } from '../context/CartContext';

/**
 * ProductCard - Card hiển thị một món ăn
 * Mobile-first design với ảnh, tên, giá, mô tả và nút thêm
 */
export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();

  // Kiểm tra số lượng hiện tại trong giỏ
  const cartItem = items.find((item) => item.product === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

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
    <div className="glass-card overflow-hidden animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/10">
      {/* Ảnh món ăn */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {/* Badge số lượng trong giỏ */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse-glow">
            {quantityInCart}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      </div>

      {/* Thông tin */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Giá + Nút thêm */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold gradient-text">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
            id={`add-to-cart-${product._id}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
