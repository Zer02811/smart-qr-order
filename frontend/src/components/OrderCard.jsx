/**
 * OrderCard - Card hiển thị đơn hàng trên Staff Dashboard
 * Hiển thị thông tin bàn, món, tổng tiền, trạng thái và nút cập nhật
 */
export default function OrderCard({ order, onUpdateStatus }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Map trạng thái → label tiếng Việt
  const statusLabels = {
    Pending: 'Chờ xử lý',
    Preparing: 'Đang làm',
    Served: 'Đã phục vụ',
  };

  // Map trạng thái → CSS class
  const statusClasses = {
    Pending: 'status-pending',
    Preparing: 'status-preparing',
    Served: 'status-served',
  };

  // Nút chuyển trạng thái tiếp theo
  const nextStatus = {
    Pending: 'Preparing',
    Preparing: 'Served',
  };

  const nextStatusLabels = {
    Pending: '👨‍🍳 Bắt đầu làm',
    Preparing: '✅ Đã phục vụ',
  };

  return (
    <div
      className={`glass-card overflow-hidden animate-slide-in-right transition-all duration-300 ${
        order.status === 'Pending' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : ''
      }`}
    >
      {/* Header: Bàn + Trạng thái + Thời gian */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Badge số bàn */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{order.tableNumber}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">Bàn {order.tableNumber}</h3>
            <div className="flex items-center gap-2">
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formatTime(order.createdAt)}
              </p>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                order.paymentMethod === 'transfer'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {order.paymentMethod === 'transfer' ? '🏦 CK' : '💵 TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Badge trạng thái */}
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusClasses[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Danh sách món */}
      <div className="p-4 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1.5 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center text-orange-400 text-xs font-bold">
                {item.quantity}
              </span>
              <span className="text-slate-200">{item.name}</span>
            </div>
            <span className="text-slate-400 text-xs">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: Tổng tiền + Nút cập nhật */}
      <div className="p-4 pt-2 border-t border-slate-700/50 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Tổng cộng</p>
          <p className="text-xl font-bold gradient-text">{formatPrice(order.totalAmount)}</p>
        </div>

        {/* Nút chuyển trạng thái (chỉ hiển thị nếu chưa Served) */}
        {nextStatus[order.status] && (
          <button
            onClick={() => onUpdateStatus(order._id, nextStatus[order.status])}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              order.status === 'Pending'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30'
            }`}
            id={`update-status-${order._id}`}
          >
            {nextStatusLabels[order.status]}
          </button>
        )}
      </div>
    </div>
  );
}
