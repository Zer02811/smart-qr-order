import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

/**
 * CartPage - Trang giỏ hàng & xác nhận đặt món
 * Tiệm dạo 5CE - Pink Pastel Theme
 * - Hiển thị danh sách items trong giỏ với ghi chú
 * - Nút tăng/giảm số lượng
 * - Nút "Xác nhận đặt món" → POST /api/orders
 */
export default function CartPage() {
  const navigate = useNavigate();
  const { items, tableNumber, totalAmount, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'transfer'

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  /**
   * Xử lý xác nhận đặt món
   */
  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    try {
      setLoading(true);
      setError('');

      const orderData = {
        tableNumber,
        paymentMethod,
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          note: item.note || '',
        })),
      };

      await api.post('/api/orders', orderData);

      // Thành công → hiển thị success screen
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      setError(
        err.response?.data?.message || 'Không thể đặt món. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Success Screen ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-300/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#4A3347] mb-2">Đặt món thành công!</h2>
          <p className="text-[#9B7D93] mb-2">Đơn hàng của bạn đã được gửi đến bếp.</p>
          <p className="text-[#9B7D93] text-sm mb-8">
            Bàn <span className="text-pink-500 font-semibold">{tableNumber}</span> • Vui lòng chờ trong giây lát
          </p>
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold shadow-lg shadow-pink-400/30 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            id="order-more"
          >
            🧋 Gọi thêm món
          </button>
        </div>
      </div>
    );
  }

  // --- Empty Cart ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-[#4A3347] mb-2">Giỏ hàng trống</h2>
          <p className="text-[#9B7D93] mb-8">Hãy chọn món yêu thích của bạn</p>
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold shadow-lg shadow-pink-400/30 transition-all active:scale-95 cursor-pointer"
            id="go-to-menu"
          >
            ← Quay lại menu
          </button>
        </div>
      </div>
    );
  }

  // --- Cart View ---
  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-4 bg-[#FFF5F7]/95 backdrop-blur-lg border-b border-pink-100">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="w-10 h-10 rounded-xl bg-white border border-pink-200 flex items-center justify-center text-[#4A3347] hover:bg-pink-50 transition-colors cursor-pointer"
            id="back-to-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#4A3347]">Giỏ hàng</h1>
            <p className="text-[#9B7D93] text-sm">
              {totalItems} món • Bàn {tableNumber}
            </p>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <main className="px-4 py-4 max-w-lg mx-auto space-y-3">
        {items.map((item) => (
          <CartItem key={item.product} item={item} />
        ))}
      </main>

      {/* Bottom: Summary + Place Order */}
      <div className="bottom-bar">
        <div className="max-w-lg mx-auto space-y-3">
          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Tổng cộng */}
          <div className="flex items-center justify-between px-2">
            <span className="text-[#9B7D93]">Tổng cộng ({totalItems} món)</span>
            <span className="text-2xl font-bold gradient-text">
              {formatPrice(totalAmount)}
            </span>
          </div>

          {/* Phương thức thanh toán */}
          <div className="px-2">
            <p className="text-sm text-[#9B7D93] mb-2">Phương thức thanh toán</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-pink-400 bg-pink-50 text-pink-500'
                    : 'border-pink-200 bg-white text-[#9B7D93] hover:border-pink-300'
                }`}
                id="payment-cash"
              >
                <span className="text-lg">💵</span>
                Tiền mặt
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'border-blue-400 bg-blue-50 text-blue-500'
                    : 'border-pink-200 bg-white text-[#9B7D93] hover:border-pink-300'
                }`}
                id="payment-transfer"
              >
                <span className="text-lg">🏦</span>
                Chuyển khoản
              </button>
            </div>
          </div>

          {/* Nút đặt món */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-pink-400 shadow-pink-400/30 hover:shadow-xl hover:shadow-pink-400/40'
            }`}
            id="confirm-order"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </span>
            ) : (
              '✅ Xác nhận đặt món'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
