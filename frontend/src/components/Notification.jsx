import { useState, useEffect } from 'react';

/**
 * Notification - Toast notification component
 * Hiển thị thông báo đơn hàng mới với animation
 */
export default function Notification({ message, type = 'info', onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Đợi animation kết thúc rồi mới remove
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Màu theo loại thông báo
  const typeStyles = {
    info: 'border-blue-500/50 bg-blue-500/10',
    success: 'border-green-500/50 bg-green-500/10',
    warning: 'border-amber-500/50 bg-amber-500/10',
    order: 'border-orange-500/50 bg-orange-500/10',
  };

  const iconMap = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    order: (
      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center animate-pulse-glow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      </div>
    ),
  };

  return (
    <div
      className={`${isVisible ? 'toast-enter' : 'toast-exit'} 
        fixed top-4 right-4 z-[100] max-w-sm w-full p-4 rounded-2xl border backdrop-blur-xl shadow-2xl
        ${typeStyles[type]}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">{iconMap[type]}</div>

        {/* Nội dung */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{message}</p>
        </div>

        {/* Nút đóng */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
