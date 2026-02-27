import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  sidebarOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      // Auto-open sidebar when item is added
      state.sidebarOpen = true;
    },
    incrementQty: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQty: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    openCartSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeCartSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  openCartSidebar,
  closeCartSidebar,
} = cartSlice.actions;

export default cartSlice.reducer;
