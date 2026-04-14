import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import OrderCard from '../components/OrderCard';
import Notification from '../components/Notification';

/**
 * StaffDashboard - Dashboard real-time cho nhân viên
 * Tiệm Dạo 5CE - Pink Pastel Theme
 * - Kết nối Socket.io và join 'staff-room'
 * - Lắng nghe NEW_ORDER → hiển thị thông báo + phát âm thanh
 * - Cập nhật trạng thái đơn hàng
 */
export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // Filter theo status
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const audioRef = useRef(null);

  /**
   * Phát âm thanh thông báo khi có đơn mới
   */
  const playNotificationSound = useCallback(() => {
    try {
      // Tạo âm thanh bằng Web Audio API nếu không có file mp3
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Melody thông báo
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification not available:', e.message);
    }
  }, []);

  /**
   * Thêm notification mới
   */
  const addNotification = useCallback((message, type = 'order') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  /**
   * Xóa notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Fetch tất cả orders từ API
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cập nhật trạng thái đơn hàng
   */
  const handleUpdateStatus = useCallback(
    async (orderId, newStatus) => {
      try {
        const res = await api.patch(`/api/orders/${orderId}`, {
          status: newStatus,
        });

        // Cập nhật local state
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? res.data.data : order
          )
        );

        addNotification(
          `Đơn hàng Bàn ${res.data.data.tableNumber} → ${
            newStatus === 'Preparing' ? 'Đang làm' : 'Đã phục vụ'
          }`,
          'success'
        );
      } catch (err) {
        console.error('Error updating order:', err);
        addNotification('Không thể cập nhật trạng thái', 'warning');
      }
    },
    [addNotification]
  );

  // --- Socket.io Connection & Events ---
  useEffect(() => {
    // Kết nối socket
    socket.connect();

    // Join staff room
    socket.emit('JOIN_STAFF_ROOM');

    // Lắng nghe xác nhận join
    socket.on('STAFF_ROOM_JOINED', (data) => {
      console.log('✅ Joined staff room:', data);
      setConnected(true);
    });

    // Lắng nghe đơn hàng mới
    socket.on('NEW_ORDER', (order) => {
      console.log('📦 New order received:', order);

      // Thêm đơn mới vào đầu danh sách
      setOrders((prev) => [order, ...prev]);

      // Thông báo
      addNotification(
        `🆕 Đơn hàng mới từ Bàn ${order.tableNumber}!`,
        'order'
      );

      // Phát âm thanh
      playNotificationSound();
    });

    // Lắng nghe cập nhật trạng thái (từ staff khác)
    socket.on('ORDER_STATUS_UPDATED', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('JOIN_STAFF_ROOM');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Cleanup khi unmount
    return () => {
      socket.off('STAFF_ROOM_JOINED');
      socket.off('NEW_ORDER');
      socket.off('ORDER_STATUS_UPDATED');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [addNotification, playNotificationSound]);

  // Fetch orders lần đầu
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- Filter orders ---
  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  // Đếm số lượng theo trạng thái
  const counts = {
    all: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Preparing: orders.filter((o) => o.status === 'Preparing').length,
    Served: orders.filter((o) => o.status === 'Served').length,
  };

  return (
    <div className="min-h-screen">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-[#FFF5F7]/95 backdrop-blur-lg border-b border-pink-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Tiệm Dạo 5CE</h1>
              <p className="text-[#9B7D93] text-sm mt-1">Quản lý đơn hàng thời gian thực</p>
            </div>

            {/* Connection status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
              connected
                ? 'bg-green-50 text-green-500 border border-green-200'
                : 'bg-red-50 text-red-400 border border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              {connected ? 'Đang kết nối' : 'Mất kết nối'}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('')}
              className={`category-tab ${filter === '' ? 'active' : ''}`}
              id="filter-all"
            >
              Tất cả ({counts.all})
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`category-tab ${filter === 'Pending' ? 'active' : ''}`}
              id="filter-pending"
            >
              🕐 Chờ ({counts.Pending})
            </button>
            <button
              onClick={() => setFilter('Preparing')}
              className={`category-tab ${filter === 'Preparing' ? 'active' : ''}`}
              id="filter-preparing"
            >
              👨‍🍳 Đang làm ({counts.Preparing})
            </button>
            <button
              onClick={() => setFilter('Served')}
              className={`category-tab ${filter === 'Served' ? 'active' : ''}`}
              id="filter-served"
            >
              ✅ Xong ({counts.Served})
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-6 max-w-5xl mx-auto">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#9B7D93] mt-4">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <p className="text-5xl mb-4">📋</p>
            <h3 className="text-xl font-semibold text-[#4A3347] mb-2">
              {filter ? 'Không có đơn hàng nào' : 'Chưa có đơn hàng'}
            </h3>
            <p className="text-[#9B7D93]">
              {filter
                ? `Không có đơn hàng với trạng thái này`
                : 'Đơn hàng mới sẽ xuất hiện ở đây khi khách gọi món'}
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
