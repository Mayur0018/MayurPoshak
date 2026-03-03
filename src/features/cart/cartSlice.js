import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems')) || [] : [],
    sidebarOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => 
        x.product === (item.product || item._id) && 
        x.variant?.sku === item.variant?.sku
      );

      if (existItem) {
        existItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      // Auto-open sidebar when item is added
      state.sidebarOpen = true;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    incrementQty: (state, action) => {
      const { id, sku, size } = typeof action.payload === 'string' ? { id: action.payload } : action.payload;
      const item = state.cartItems.find((x) => 
        (x._id || x.product) === id && 
        (sku ? x.variant?.sku === sku : true) &&
        (size ? (x.selectedSize === size || x.size === size) : true)
      );
      if (item) item.quantity += 1;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    decrementQty: (state, action) => {
      const { id, sku, size } = typeof action.payload === 'string' ? { id: action.payload } : action.payload;
      const item = state.cartItems.find((x) => 
        (x._id || x.product) === id && 
        (sku ? x.variant?.sku === sku : true) &&
        (size ? (x.selectedSize === size || x.size === size) : true)
      );
      if (item && item.quantity > 1) item.quantity -= 1;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { id, sku, size } = typeof action.payload === 'string' ? { id: action.payload } : action.payload;
      state.cartItems = state.cartItems.filter((x) => 
        !((x._id || x.product) === id && 
          (sku ? x.variant?.sku === sku : true) && 
          (size ? (x.selectedSize === size || x.size === size) : true))
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    closeCartSidebar: (state) => {
      state.sidebarOpen = false;
    },
    openCartSidebar: (state) => {
      state.sidebarOpen = true;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQty, decrementQty, closeCartSidebar, openCartSidebar } = cartSlice.actions;
export default cartSlice.reducer;
