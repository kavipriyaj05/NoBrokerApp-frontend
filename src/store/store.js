// Redux Store — Kavi's file (updated by Jeyanth)
// All slices registered

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import propertyReducer from './propertySlice';
import bookingReducer from './bookingSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    booking: bookingReducer,
    admin: adminReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
