// categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryServices: [],
  },
  reducers: {
    setCategoryServices: (state, action) => {
      state.categoryServices = action.payload;
    },
  },
});

export const { setCategoryServices } = categorySlice.actions;
export default categorySlice.reducer;
