/**
 * ============================================
 *  Seed Data - Dữ liệu mẫu cho Menu, Admin & Bàn
 * ============================================
 *  Chạy: npm run seed
 *  Sẽ xóa toàn bộ dữ liệu cũ và thêm mới
 * ============================================
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const Table = require('./models/Table');
const connectDB = require('./config/db');

// ========== ADMIN MẶC ĐỊNH ==========
const defaultAdmin = {
  username: 'admin',
  password: 'admin123',
  name: 'Quản trị viên',
};

// ========== BÀN MẪU ==========
const sampleTables = [
  { number: '01', name: 'Bàn 1', seats: 4 },
  { number: '02', name: 'Bàn 2', seats: 4 },
  { number: '03', name: 'Bàn 3', seats: 4 },
  { number: '04', name: 'Bàn 4', seats: 6 },
  { number: '05', name: 'Bàn 5', seats: 6 },
  { number: '06', name: 'Bàn VIP 1', seats: 8 },
  { number: '07', name: 'Bàn VIP 2', seats: 8 },
  { number: '08', name: 'Bàn ngoài sân', seats: 4 },
  { number: '09', name: 'Bàn ngoài sân', seats: 4 },
  { number: '10', name: 'Bàn bar', seats: 2 },
];

// ========== MÓN MẪU ==========
const sampleProducts = [
  // ========== MÓN CHÍNH ==========
  {
    name: 'Phở Bò Tái Nạm',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
    category: 'Món chính',
    description: 'Phở bò truyền thống với nước dùng ninh xương 12 tiếng, thịt bò tái nạm tươi.',
    isAvailable: true,
  },
  {
    name: 'Cơm Tấm Sườn Bì Chả',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    category: 'Món chính',
    description: 'Cơm tấm Sài Gòn với sườn nướng, bì, chả trứng và nước mắm đặc biệt.',
    isAvailable: true,
  },
  {
    name: 'Bún Chả Hà Nội',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    category: 'Món chính',
    description: 'Bún chả với thịt nướng than hoa, chả viên và nước chấm chua ngọt.',
    isAvailable: true,
  },
  {
    name: 'Mì Quảng',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&h=300&fit=crop',
    category: 'Món chính',
    description: 'Mì Quảng đặc sản miền Trung, tôm thịt và nước dùng đậm đà.',
    isAvailable: true,
  },
  {
    name: 'Cơm Chiên Dương Châu',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    category: 'Món chính',
    description: 'Cơm chiên với tôm, lạp xưởng, trứng và rau củ tươi.',
    isAvailable: true,
  },

  // ========== KHAI VỊ ==========
  {
    name: 'Gỏi Cuốn Tôm Thịt',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop',
    category: 'Khai vị',
    description: '4 cuốn gỏi cuốn tươi với tôm, thịt, bún và rau thơm. Kèm nước chấm.',
    isAvailable: true,
  },
  {
    name: 'Chả Giò Rán',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    category: 'Khai vị',
    description: '6 chiếc chả giò giòn rụm với nhân thịt, miến, nấm mèo.',
    isAvailable: true,
  },
  {
    name: 'Bánh Mì Pate',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=300&fit=crop',
    category: 'Khai vị',
    description: 'Bánh mì giòn thơm với pate, dăm bông, dưa leo và ngò rí.',
    isAvailable: true,
  },
  {
    name: 'Súp Cua',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    category: 'Khai vị',
    description: 'Súp cua thơm ngon với trứng bắc thảo và nấm.',
    isAvailable: true,
  },

  // ========== TRÁNG MIỆNG ==========
  {
    name: 'Chè Thái',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    category: 'Tráng miệng',
    description: 'Chè Thái mát lạnh với trái cây, thạch và nước cốt dừa.',
    isAvailable: true,
  },
  {
    name: 'Bánh Flan Caramel',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&h=300&fit=crop',
    category: 'Tráng miệng',
    description: 'Bánh flan mềm mịn với lớp caramel đắng nhẹ.',
    isAvailable: true,
  },
  {
    name: 'Kem Dừa',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    category: 'Tráng miệng',
    description: 'Kem dừa tươi mát, thơm béo tự nhiên.',
    isAvailable: true,
  },

  // ========== ĐỒ UỐNG ==========
  {
    name: 'Trà Đá',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    category: 'Đồ uống',
    description: 'Trà đá truyền thống, mát lạnh.',
    isAvailable: true,
  },
  {
    name: 'Cà Phê Sữa Đá',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop',
    category: 'Đồ uống',
    description: 'Cà phê phin pha sữa đặc, đậm đà kiểu Việt Nam.',
    isAvailable: true,
  },
  {
    name: 'Sinh Tố Bơ',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&h=300&fit=crop',
    category: 'Đồ uống',
    description: 'Sinh tố bơ béo ngậy, thơm mát tự nhiên.',
    isAvailable: true,
  },
  {
    name: 'Nước Chanh Dây',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
    category: 'Đồ uống',
    description: 'Nước chanh dây tươi, chua ngọt thanh mát.',
    isAvailable: true,
  },
  {
    name: 'Trà Sen Vàng',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    category: 'Đồ uống',
    description: 'Trà ướp hương sen, vị thanh nhẹ, thư giãn.',
    isAvailable: true,
  },
];

/**
 * Chạy seed: Xóa dữ liệu cũ và thêm dữ liệu mẫu
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // --- Xóa dữ liệu cũ ---
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Table.deleteMany({});
    console.log('🗑️  Đã xóa toàn bộ dữ liệu cũ');

    // --- Tạo Admin mặc định ---
    const admin = await Admin.create(defaultAdmin);
    console.log(`👤 Tạo admin: ${admin.username} / admin123`);

    // --- Tạo bàn mẫu ---
    const tables = await Table.insertMany(sampleTables);
    console.log(`🪑 Đã tạo ${tables.length} bàn`);

    // --- Thêm sản phẩm mẫu ---
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Đã thêm ${createdProducts.length} sản phẩm mẫu:`);

    // Hiển thị tóm tắt theo category
    const categories = [...new Set(sampleProducts.map((p) => p.category))];
    categories.forEach((cat) => {
      const count = sampleProducts.filter((p) => p.category === cat).length;
      console.log(`   📂 ${cat}: ${count} món`);
    });

    console.log('\n🎉 Seed data thành công!');
    console.log('📌 Admin login: admin / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data thất bại:', error.message);
    process.exit(1);
  }
};

seedDatabase();
