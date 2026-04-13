import { useCart } from '../context/CartContext';

/**
 * CartItem - Hiển thị một item trong giỏ hàng
 * Có nút tăng/giảm số lượng và xóa
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="glass-card p-4 flex gap-4 animate-fade-in-up">
      {/* Ảnh thu nhỏ */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
        <p className="text-orange-400 font-bold text-sm mt-1">
          {formatPrice(item.price)}
        </p>

        {/* Controls số lượng */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => updateQuantity(item.product, item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors active:scale-90 cursor-pointer"
            id={`decrease-${item.product}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          <span className="text-white font-semibold text-base min-w-[20px] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.product, item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-400 transition-colors active:scale-90 cursor-pointer"
            id={`increase-${item.product}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Nút xóa */}
          <button
            onClick={() => removeFromCart(item.product)}
            className="ml-auto w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
            id={`remove-${item.product}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tổng giá item */}
      <div className="flex-shrink-0 text-right">
        <p className="text-white font-bold text-sm">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
