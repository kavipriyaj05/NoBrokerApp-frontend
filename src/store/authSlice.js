// Redux Auth Slice — Kavi's file
// Jeyanth reads: useSelector(state => state.auth)
// Shape: { token, role, name, email, userId, isAuthenticated }

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// ─── Thunks ───────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', otpData);
      const { token, role, name, email, userId } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, name, email, userId }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, role, name, email, userId } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, name, email, userId }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/google/verify', { idToken });
      const { token, role, name, email, userId } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, name, email, userId }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Google login failed'
      );
    }
  }
);

// ─── Helpers ──────────────────────────────────────────

const getInitialState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    try {
      const parsed = JSON.parse(user);
      return {
        token,
        role: parsed.role,
        name: parsed.name,
        email: parsed.email,
        userId: parsed.userId,
        isAuthenticated: true,
        loading: false,
        error: null,
        otpSent: false,
        otpEmail: null,
      };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return {
    token: null,
    role: null,
    name: null,
    email: null,
    userId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    otpSent: false,
    otpEmail: null,
  };
};

// ─── Slice ────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.otpEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
    clearOtpState(state) {
      state.otpSent = false;
      state.otpEmail = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.otpEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const { token, role, name, email, userId } = action.payload.data;
        state.loading = false;
        state.token = token;
        state.role = role;
        state.name = name;
        state.email = email;
        state.userId = userId;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.otpEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, role, name, email, userId } = action.payload.data;
        state.loading = false;
        state.token = token;
        state.role = role;
        state.name = name;
        state.email = email;
        state.userId = userId;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Google Login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        const { token, role, name, email, userId } = action.payload.data;
        state.loading = false;
        state.token = token;
        state.role = role;
        state.name = name;
        state.email = email;
        state.userId = userId;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearOtpState } = authSlice.actions;
export default authSlice.reducer;
