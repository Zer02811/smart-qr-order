import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

/**
 * AdminLoginPage - Trang đăng nhập admin
 * Tiệm Dạo 5CE - Pink Pastel Theme
 */
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { username, password });

      // Lưu token vào localStorage
      localStorage.setItem('adminToken', res.data.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.data.data.admin));

      // Chuyển tới admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center shadow-2xl shadow-pink-400/30 animate-float">
            <span className="text-4xl">🧋</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Tiệm Dạo 5CE</h1>
          <p className="text-[#9B7D93] text-sm mt-1">Đăng nhập quản trị</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="glass-card p-6 space-y-5">
          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#4A3347] mb-1.5">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4A3347] mb-1.5">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all cursor-pointer ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-pink-400 hover:shadow-lg hover:shadow-pink-400/30 active:scale-[0.98]'
            }`}
            id="admin-login-btn"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
