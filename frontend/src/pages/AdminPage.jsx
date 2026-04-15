import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

/**
 * AdminPage - Dashboard quản lý Bàn & Món ăn
 * Tiệm Dạo 5CE - Pink Pastel Theme
 * - Yêu cầu đăng nhập (JWT token)
 * - 2 tabs: Quản lý bàn / Quản lý món
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tables'); // 'tables' | 'products'
  const [adminInfo, setAdminInfo] = useState(null);

  // --- Tables state ---
  const [tables, setTables] = useState([]);
  const [tableForm, setTableForm] = useState({ number: '', name: '', seats: 4 });
  const [editingTable, setEditingTable] = useState(null);

  // --- Products state ---
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '', price: '', image: '', category: 'Đồ uống', description: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // --- Common state ---
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  /**
   * Lấy auth header với JWT token
   */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  /**
   * Hiển thị thông báo tạm thời
   */
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  /**
   * Kiểm tra auth khi mount
   */
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Verify token
    api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setAdminInfo(res.data.data);
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
      });
  }, [navigate]);

  // ============================
  //  Tables CRUD
  // ============================

  const fetchTables = useCallback(async () => {
    try {
      const res = await api.get('/api/tables');
      setTables(res.data.data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  }, []);

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tables', tableForm, getAuthHeaders());
      showMessage(`Đã tạo bàn ${tableForm.number}`);
      setTableForm({ number: '', name: '', seats: 4 });
      fetchTables();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi tạo bàn', 'error');
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/tables/${editingTable._id}`, tableForm, getAuthHeaders());
      showMessage('Cập nhật bàn thành công');
      setEditingTable(null);
      setTableForm({ number: '', name: '', seats: 4 });
      fetchTables();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi cập nhật', 'error');
    }
  };

  const handleDeleteTable = async (table) => {
    if (!confirm(`Xóa bàn ${table.number}?`)) return;
    try {
      await api.delete(`/api/tables/${table._id}`, getAuthHeaders());
      showMessage(`Đã xóa bàn ${table.number}`);
      fetchTables();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi xóa bàn', 'error');
    }
  };

  const startEditTable = (table) => {
    setEditingTable(table);
    setTableForm({ number: table.number, name: table.name, seats: table.seats });
  };

  const cancelEditTable = () => {
    setEditingTable(null);
    setTableForm({ number: '', name: '', seats: 4 });
  };

  const toggleTableActive = async (table) => {
    try {
      await api.put(`/api/tables/${table._id}`, { ...table, isActive: !table.isActive }, getAuthHeaders());
      fetchTables();
    } catch (err) {
      showMessage('Lỗi cập nhật trạng thái', 'error');
    }
  };

  // ============================
  //  Products CRUD
  // ============================

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/api/products/all', getAuthHeaders());
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', {
        ...productForm,
        price: Number(productForm.price),
      }, getAuthHeaders());
      showMessage('Tạo món thành công');
      setProductForm({ name: '', price: '', image: '', category: 'Đồ uống', description: '' });
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi tạo món', 'error');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${editingProduct._id}`, {
        ...productForm,
        price: Number(productForm.price),
      }, getAuthHeaders());
      showMessage('Cập nhật thành công');
      setEditingProduct(null);
      setShowProductForm(false);
      setProductForm({ name: '', price: '', image: '', category: 'Đồ uống', description: '' });
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi cập nhật', 'error');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Xóa "${product.name}"?`)) return;
    try {
      await api.delete(`/api/products/${product._id}`, getAuthHeaders());
      showMessage(`Đã xóa "${product.name}"`);
      cancelEditProduct();
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Lỗi xóa món', 'error');
    }
  };

  const toggleProductAvailable = async (product) => {
    try {
      await api.put(`/api/products/${product._id}`, {
        isAvailable: !product.isAvailable,
      }, getAuthHeaders());
      fetchProducts();
    } catch (err) {
      showMessage('Lỗi cập nhật', 'error');
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
    });
    setShowProductForm(true);
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', image: '', category: 'Đồ uống', description: '' });
    setShowProductForm(false);
  };

  // Fetch data khi mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTables(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, [fetchTables, fetchProducts]);

  /**
   * Đăng xuất
   */
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  /**
   * Copy QR link
   */
  const copyQRLink = (tableNumber) => {
    const link = `${window.location.origin}/order?table=${tableNumber}`;
    navigator.clipboard.writeText(link);
    showMessage(`Đã copy link bàn ${tableNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl animate-slide-in-right ${
          message.type === 'error'
            ? 'bg-red-500/90 text-white'
            : 'bg-green-500/90 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF5F7]/95 backdrop-blur-lg border-b border-pink-100" style={{ padding: '16px 20px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Tiệm Dạo 5CE</h1>
            <p className="text-[#9B7D93] text-sm mt-0.5">
              Xin chào, {adminInfo?.name || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/staff"
              style={{ padding: '10px 20px' }}
              className="rounded-xl bg-blue-50 text-blue-500 text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              📋 Staff Dashboard
            </a>
            <button
              onClick={handleLogout}
              style={{ padding: '10px 20px' }}
              className="rounded-xl bg-red-50 text-red-400 text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              id="logout-btn"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto flex justify-center gap-3 mt-5" style={{ padding: '0 16px' }}>
          <button
            onClick={() => setActiveTab('tables')}
            style={{ padding: '8px 16px', fontSize: '13px' }}
            className={`category-tab ${activeTab === 'tables' ? 'active' : ''}`}
            id="tab-tables"
          >
            🪑 Quản lý bàn ({tables.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{ padding: '8px 16px', fontSize: '13px' }}
            className={`category-tab ${activeTab === 'products' ? 'active' : ''}`}
            id="tab-products"
          >
            🧋 Quản lý món ({products.length})
          </button>
        </div>
      </header>

      <main style={{ padding: '24px 20px' }} className="max-w-6xl mx-auto">

        {/* ==============================
            TAB: QUẢN LÝ BÀN
        ============================== */}
        {activeTab === 'tables' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Form thêm/sửa bàn */}
            <form
              onSubmit={editingTable ? handleUpdateTable : handleCreateTable}
              className="glass-card"
              style={{ padding: '24px' }}
            >
              <h3 className="text-lg font-semibold text-[#4A3347] mb-4">
                {editingTable ? '✏️ Sửa bàn' : '➕ Thêm bàn mới'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Số bàn"
                  value={tableForm.number}
                  onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
                  required
                  disabled={!!editingTable}
                  style={{ padding: '14px 18px' }}
                  className="rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Tên bàn"
                  value={tableForm.name}
                  onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
                  style={{ padding: '14px 18px' }}
                  className="rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    style={{ padding: '12px 24px' }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold hover:shadow-lg hover:shadow-pink-400/30 transition-all active:scale-95 cursor-pointer"
                  >
                    {editingTable ? 'Lưu' : 'Thêm'}
                  </button>
                  {editingTable && (
                    <button
                      type="button"
                      onClick={cancelEditTable}
                      style={{ padding: '12px 20px' }}
                      className="rounded-xl bg-gray-100 text-[#9B7D93] hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Danh sách bàn - Mobile-friendly cards */}
            <div className="space-y-3">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="glass-card flex items-center gap-3"
                  style={{ padding: '14px 18px' }}
                >
                  {/* Số bàn */}
                  <span className="w-11 h-11 flex-shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-400 text-white font-bold text-lg shadow-md">
                    {table.number}
                  </span>
                  {/* Tên bàn */}
                  <span className="flex-1 text-[#4A3347] font-medium text-sm truncate min-w-0">
                    {table.name}
                  </span>
                  {/* Copy link */}
                  <button
                    onClick={() => copyQRLink(table.number)}
                    style={{ padding: '8px 16px' }}
                    className="flex-shrink-0 rounded-lg bg-blue-50 text-blue-500 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    📋 Link
                  </button>
                  {/* Xóa */}
                  <button
                    onClick={() => handleDeleteTable(table)}
                    style={{ padding: '8px 14px' }}
                    className="flex-shrink-0 rounded-lg bg-red-50 text-red-400 text-xs font-semibold border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {tables.length === 0 && (
                <div className="text-center py-10 text-[#9B7D93]">Chưa có bàn nào</div>
              )}
            </div>
          </div>
        )}

        {/* ==============================
            TAB: QUẢN LÝ MÓN
        ============================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Nút thêm món */}
            {!showProductForm && (
              <div className="flex justify-center">
                <button
                  onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
                  style={{ padding: '14px 28px' }}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold hover:shadow-lg hover:shadow-pink-400/30 transition-all active:scale-95 cursor-pointer"
                  id="add-product-btn"
                >
                  ➕ Thêm món mới
                </button>
              </div>
            )}

            {/* Form thêm/sửa món */}
            {showProductForm && (
              <form
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                className="glass-card space-y-4"
                style={{ padding: '24px' }}
              >
                <h3 className="text-lg font-semibold text-[#4A3347]">
                  {editingProduct ? '✏️ Sửa món' : '➕ Thêm món mới'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tên món *"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="Giá (VND) *"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    min="0"
                    className="px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                  <input
                    type="url"
                    placeholder="URL ảnh"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] focus:outline-none focus:border-pink-400 transition-colors"
                  >
                    <option value="Đồ uống">🧋 Đồ uống</option>
                    <option value="Đồ ăn vặt">🍿 Đồ ăn vặt</option>
                  </select>
                </div>
                <textarea
                  placeholder="Mô tả món"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#4A3347] placeholder-pink-300 focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="submit"
                    style={{ padding: '12px 28px' }}
                    className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    {editingProduct ? 'Lưu thay đổi' : 'Tạo món'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(editingProduct)}
                      style={{ padding: '12px 28px' }}
                      className="rounded-xl bg-red-50 text-red-400 font-semibold border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      🗑️ Xóa món này
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={cancelEditProduct}
                    style={{ padding: '12px 28px' }}
                    className="rounded-xl bg-gray-100 text-[#9B7D93] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {/* Danh sách món */}
            {/* Danh sách món - Mobile-friendly cards */}
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`glass-card flex items-center gap-4 transition-all ${!product.isAvailable ? 'opacity-50' : ''}`}
                  style={{ padding: '14px 18px' }}
                >
                  {/* Ảnh */}
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop'}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  {/* Tên món */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#4A3347] font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-pink-400 text-xs font-medium mt-0.5">{formatPrice(product.price)}</p>
                  </div>
                  {/* Nút sửa */}
                  <button
                    onClick={() => startEditProduct(product)}
                    style={{ padding: '10px 20px' }}
                    className="flex-shrink-0 rounded-xl bg-amber-50 text-amber-500 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
                  >
                    ✏️ Sửa
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-10 text-[#9B7D93]">Chưa có món nào</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
