// Redux Admin Slice — Jeyanth's file
// Manages admin operations: approve/reject properties, view all users, stats

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// ─── Thunks ───────────────────────────────────────────

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin stats'
      );
    }
  }
);

export const fetchPendingProperties = createAsyncThunk(
  'admin/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/properties/pending');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pending properties'
      );
    }
  }
);

export const fetchAllProperties = createAsyncThunk(
  'admin/fetchAllProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/properties?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch properties'
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'admin/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const approveProperty = createAsyncThunk(
  'admin/approveProperty',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/properties/${id}/approve`);
      return { id, data: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve property'
      );
    }
  }
);

export const rejectProperty = createAsyncThunk(
  'admin/rejectProperty',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/properties/${id}/reject`, { reason });
      return { id, data: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject property'
      );
    }
  }
);

export const confirmBookingAdmin = createAsyncThunk(
  'admin/confirmBooking',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/bookings/${id}/confirm`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to confirm booking'
      );
    }
  }
);

export const cancelBookingAdmin = createAsyncThunk(
  'admin/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/bookings/${id}/cancel`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    pendingProperties: [],
    allProperties: [],
    allUsers: [],
    allBookings: [],
    loading: false,
    actionLoading: null, // id being acted upon
    error: null,
    success: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
    clearAdminSuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Pending properties
    builder
      .addCase(fetchPendingProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingProperties = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchPendingProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // All properties
    builder
      .addCase(fetchAllProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.allProperties = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // All users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // All bookings
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Approve property
    builder
      .addCase(approveProperty.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(approveProperty.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.pendingProperties = state.pendingProperties.filter(
          (p) => p.id !== action.payload.id
        );
        const idx = state.allProperties.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.allProperties[idx].status = 'APPROVED';
        state.success = 'Property approved successfully!';
      })
      .addCase(approveProperty.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });

    // Reject property
    builder
      .addCase(rejectProperty.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
      })
      .addCase(rejectProperty.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.pendingProperties = state.pendingProperties.filter(
          (p) => p.id !== action.payload.id
        );
        const idx = state.allProperties.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.allProperties[idx].status = 'REJECTED';
        state.success = 'Property rejected.';
      })
      .addCase(rejectProperty.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });

    // Confirm booking
    builder
      .addCase(confirmBookingAdmin.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(confirmBookingAdmin.fulfilled, (state, action) => {
        state.actionLoading = null;
        const idx = state.allBookings.findIndex((b) => b.id === action.payload);
        if (idx !== -1) state.allBookings[idx].status = 'CONFIRMED';
        state.success = 'Booking confirmed!';
      })
      .addCase(confirmBookingAdmin.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });

    // Cancel booking (admin)
    builder
      .addCase(cancelBookingAdmin.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(cancelBookingAdmin.fulfilled, (state, action) => {
        state.actionLoading = null;
        const idx = state.allBookings.findIndex((b) => b.id === action.payload);
        if (idx !== -1) state.allBookings[idx].status = 'CANCELLED';
        state.success = 'Booking cancelled.';
      })
      .addCase(cancelBookingAdmin.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
