/**
 * OrderCard - Card hiển thị đơn hàng trên Staff Dashboard
 * Hiển thị thông tin bàn, món, ghi chú, tổng tiền, trạng thái và nút cập nhật
 * Pink pastel theme - Tiệm Dạo 5CE
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
        order.status === 'Pending' ? 'border-amber-400/50 shadow-lg shadow-amber-300/10' : ''
      }`}
    >
      {/* Header: Bàn + Trạng thái + Thời gian */}
      <div style={{ padding: '20px 24px' }} className="flex items-center justify-between border-b border-pink-100 gap-3">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Badge số bàn */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-300/30">
            <span className="text-white font-bold text-xl">{order.tableNumber}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[#4A3347] font-bold text-lg truncate">Bàn {order.tableNumber}</h3>
            <div className="flex items-center gap-3 flex-wrap mt-1">
              <p className="text-[#9B7D93] text-xs flex items-center gap-1 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formatTime(order.createdAt)}
              </p>
              <span className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap ${
                order.paymentMethod === 'transfer'
                  ? 'bg-blue-50 text-blue-500 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-500 border border-emerald-200'
              }`}
              style={{ padding: '5px 12px' }}
              >
                {order.paymentMethod === 'transfer' ? '🏦 CK' : '💵 TM'}
              </span>
            </div>
          </div>
        </div>

        {/* Badge trạng thái */}
        <span style={{ padding: '12px 24px' }} className={`flex-shrink-0 whitespace-nowrap rounded-full text-xs font-bold ${statusClasses[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Danh sách món */}
      <div style={{ padding: '20px 24px' }} className="space-y-0">
        {order.items.map((item, index) => (
          <div key={index} style={{ padding: '10px 0' }} className={index !== order.items.length - 1 ? 'border-b border-pink-50' : ''}>
            <div className="flex items-center justify-between text-sm gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0 w-7 h-7 rounded-md bg-pink-100 flex items-center justify-center text-pink-500 text-sm font-bold">
                  {item.quantity}
                </span>
                <span className="text-[#4A3347] truncate">{item.name}</span>
              </div>
              <span className="flex-shrink-0 text-[#9B7D93] text-xs">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
            {/* Hiển thị ghi chú nếu có */}
            {item.note && (
              <div className="ml-8 mt-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/50 text-amber-700 text-xs flex items-center gap-1">
                <span>📝</span> {item.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer: Tổng tiền + Nút cập nhật */}
      <div style={{ padding: '20px 24px' }} className="border-t border-pink-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#9B7D93] mb-1">Tổng cộng</p>
          <p className="text-2xl font-bold gradient-text truncate">{formatPrice(order.totalAmount)}</p>
        </div>

        {/* Nút chuyển trạng thái (chỉ hiển thị nếu chưa Served) */}
        {nextStatus[order.status] && (
          <button
            onClick={() => onUpdateStatus(order._id, nextStatus[order.status])}
            style={{ padding: '16px 36px' }}
            className={`flex-shrink-0 whitespace-nowrap rounded-2xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
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
