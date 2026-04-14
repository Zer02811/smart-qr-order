import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

/**
 * MenuPage - Trang menu cho khách hàng (Mobile First)
 * Tiệm Dạo 5CE - Pink Pastel Theme
 * - Lấy tableNumber từ URL: /order?table=05
 * - Hiển thị danh sách món ăn theo category
 * - Floating cart badge ở dưới
 */
export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTableNumber, totalItems, totalAmount, tableNumber } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy số bàn từ URL query param
  useEffect(() => {
    const table = searchParams.get('table') || '01';
    setTableNumber(table);
  }, [searchParams, setTableNumber]);

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/products/categories'),
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải menu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc products theo category đang chọn
  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  // Format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#FFF5F7] via-[#FFF5F7]/95 to-[#FFF5F7]/0" style={{ padding: '16px 20px 12px' }}>
        <div className="max-w-lg mx-auto">
          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Tiệm Dạo 5CE</h1>
              <p className="text-[#9B7D93] text-sm mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
                Bàn {tableNumber || '...'}
              </p>
            </div>
            {/* Mini logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-300/30 animate-float">
              <span className="text-xl">🧋</span>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '0 20px' }} className="max-w-lg mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#9B7D93] mt-4">Đang tải menu...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg mb-4">😕 {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-400 transition-colors cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <p className="text-[#9B7D93] text-sm mb-4">
              {filteredProducts.length} món{activeCategory ? ` trong "${activeCategory}"` : ''}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🧋</p>
            <p className="text-[#9B7D93]">Không có món nào trong danh mục này</p>
          </div>
        )}
      </main>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="bottom-bar animate-fade-in-up">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => navigate('/cart')}
              style={{ padding: '18px 28px' }}
              className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold shadow-lg shadow-pink-400/30 hover:shadow-xl hover:shadow-pink-400/40 transition-all active:scale-[0.98] cursor-pointer"
              id="go-to-cart"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-pink-500 text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span>Xem giỏ hàng</span>
              </div>
              <span className="text-lg font-bold">{formatPrice(totalAmount)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
