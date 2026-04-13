import { createContext, useContext, useReducer, useCallback } from 'react';

/** Context cho giỏ hàng */
const CartContext = createContext(null);

// --- Action types ---
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_TABLE: 'SET_TABLE',
};

// --- Initial state ---
const initialState = {
  items: [],        // [{ product, name, price, image, quantity }]
  tableNumber: '',  // Số bàn từ URL query
};

/**
 * Reducer xử lý các action của giỏ hàng
 */
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      // Kiểm tra món đã có trong giỏ chưa
      const existingIndex = state.items.findIndex(
        (item) => item.product === product._id
      );

      if (existingIndex >= 0) {
        // Đã có → tăng số lượng
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }

      // Chưa có → thêm mới
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ],
      };
    }

    case ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product !== action.payload.productId
        ),
      };
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Nếu số lượng <= 0, xóa khỏi giỏ
        return {
          ...state,
          items: state.items.filter((item) => item.product !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        ),
      };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case ACTIONS.SET_TABLE:
      return { ...state, tableNumber: action.payload };

    default:
      return state;
  }
}

/**
 * CartProvider - Cung cấp Cart context cho toàn app
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { product } });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  const setTableNumber = useCallback((tableNumber) => {
    dispatch({ type: ACTIONS.SET_TABLE, payload: tableNumber });
  }, []);

  // Tính tổng số lượng & tổng tiền
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    tableNumber: state.tableNumber,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setTableNumber,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook để sử dụng Cart context
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
