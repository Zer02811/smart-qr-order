/**
 * CategoryFilter - Tabs lọc món theo danh mục
 * Hiển thị dạng scrollable horizontal trên mobile
 * Chỉ 2 category: Đồ uống, Đồ ăn vặt
 */
export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      {/* Tab "Tất cả" */}
      <button
        onClick={() => onSelect('')}
        className={`category-tab ${activeCategory === '' ? 'active' : ''}`}
        id="category-all"
      >
        🧋 Tất cả
      </button>

      {/* Tabs cho từng category */}
      {categories.map((category) => {
        // Emoji cho từng loại (quán trà sữa & đồ ăn vặt)
        const emoji = {
          'Đồ uống': '🧋',
          'Đồ ăn vặt': '🍿',
        }[category] || '📂';

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            id={`category-${category}`}
          >
            {emoji} {category}
          </button>
        );
      })}
    </div>
  );
}
