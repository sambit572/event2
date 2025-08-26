import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice.js";
import vendorReducer from "./VendorSlice.js";
import categoryReducer from "./categorySlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    vendor: vendorReducer,
    category: categoryReducer,
  },
});
