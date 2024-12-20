import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsReducer from "./products-slice";
import shopProductsReducer from "./shop-products-slice";
import cartProductReducer from "./cart-slice";
import shopAddressReducer from "./address-slice";
import shopOrderReducer from "./order-slice";
import adminOrderReducer from "./admin-order-slice";
import shopSearchReducer from "./search-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shopProducts: shopProductsReducer,
    cartProductReducer: cartProductReducer,
    shopAddress: shopAddressReducer,
    shopOrder: shopOrderReducer,
    adminOrder: adminOrderReducer,
    shopSearch: shopSearchReducer,
  }
})

export default store;