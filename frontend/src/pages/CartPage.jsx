import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

/**
 * CartPage - Trang giỏ hàng & xác nhận đặt món
 * - Hiển thị danh sách items trong giỏ
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
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Đặt món thành công!</h2>
          <p className="text-slate-400 mb-2">Đơn hàng của bạn đã được gửi đến bếp.</p>
          <p className="text-slate-500 text-sm mb-8">
            Bàn <span className="text-orange-400 font-semibold">{tableNumber}</span> • Vui lòng chờ trong giây lát
          </p>
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            id="order-more"
          >
            🍽️ Gọi thêm món
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
          <h2 className="text-xl font-bold text-white mb-2">Giỏ hàng trống</h2>
          <p className="text-slate-400 mb-8">Hãy chọn món ăn yêu thích của bạn</p>
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
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
      <header className="sticky top-0 z-40 px-4 py-4 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors cursor-pointer"
            id="back-to-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Giỏ hàng</h1>
            <p className="text-slate-400 text-sm">
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
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Tổng cộng */}
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-400">Tổng cộng ({totalItems} món)</span>
            <span className="text-2xl font-bold gradient-text">
              {formatPrice(totalAmount)}
            </span>
          </div>

          {/* Phương thức thanh toán */}
          <div className="px-2">
            <p className="text-sm text-slate-400 mb-2">Phương thức thanh toán</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-slate-600/50 bg-slate-800/50 text-slate-400 hover:border-slate-500'
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
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-600/50 bg-slate-800/50 text-slate-400 hover:border-slate-500'
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
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
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
