import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../utils/constant";

const initialState = {
  user: null,
  cartCount: 0,
};

export const fetchCart = createAsyncThunk("user/fetchCart", async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/cart`, {
      withCredentials: true,
    });
    return { count: res.data.count };
  } catch (error) {
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      console.error("Error fetching cart:", error);
    }
    return { count: 0 };
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      console.log("set user worked fine and have user :", state.user);
    },
    clearUser: (state) => {
      state.user = null;
      state.cartCount = 0;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    incrementCartCount: (state) => {
      state.cartCount += 1;
    },
    // ✅ NEW: Add decrementCartCount reducer
    decrementCartCount: (state) => {
      if (state.cartCount > 0) {
        state.cartCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartCount = action.payload.count;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        console.error("Failed to fetch cart:", action.error);
        state.cartCount = 0;
      });
  },
});

// ✅ UPDATED: Export the new action
export const {
  setUser,
  clearUser,
  setCartCount,
  incrementCartCount,
  decrementCartCount,
} = userSlice.actions;
export default userSlice.reducer;
