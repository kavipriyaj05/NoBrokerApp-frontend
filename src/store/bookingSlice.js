// Redux Booking Slice — Jeyanth's file
// Manages visit bookings for properties + owner booking management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// ─── Thunks ───────────────────────────────────────────

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/my');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

// ─── Owner Thunks ─────────────────────────────────────

export const fetchOwnerBookings = createAsyncThunk(
  'booking/fetchOwnerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/owner');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch owner bookings'
      );
    }
  }
);

export const confirmOwnerBooking = createAsyncThunk(
  'booking/confirmOwner',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/bookings/${id}/confirm`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to confirm booking'
      );
    }
  }
);

export const rejectOwnerBooking = createAsyncThunk(
  'booking/rejectOwner',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await api.patch(`/bookings/${id}/reject`, { reason });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject booking'
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    ownerBookings: [],
    loading: false,
    ownerLoading: false,
    creating: false,
    cancelling: null,
    confirming: null,
    rejecting: null,
    error: null,
    success: null,
  },
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearBookingSuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my bookings
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.bookings.unshift(action.payload);
        state.success = 'Visit scheduled successfully!';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state, action) => {
        state.cancelling = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelling = null;
        const idx = state.bookings.findIndex((b) => b.id === action.payload);
        if (idx !== -1) state.bookings[idx].status = 'CANCELLED';
        state.success = 'Booking cancelled successfully';
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelling = null;
        state.error = action.payload;
      });

    // ─── Owner bookings ───────────────────────────────

    // Fetch owner bookings
    builder
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.ownerLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.ownerLoading = false;
        state.ownerBookings = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.ownerLoading = false;
        state.error = action.payload;
      });

    // Confirm owner booking
    builder
      .addCase(confirmOwnerBooking.pending, (state, action) => {
        state.confirming = action.meta.arg;
        state.error = null;
      })
      .addCase(confirmOwnerBooking.fulfilled, (state, action) => {
        state.confirming = null;
        const idx = state.ownerBookings.findIndex((b) => b.id === action.payload);
        if (idx !== -1) state.ownerBookings[idx].status = 'CONFIRMED';
        state.success = 'Booking confirmed! Confirmation email sent to the user.';
      })
      .addCase(confirmOwnerBooking.rejected, (state, action) => {
        state.confirming = null;
        state.error = action.payload;
      });

    // Reject owner booking
    builder
      .addCase(rejectOwnerBooking.pending, (state, action) => {
        state.rejecting = action.meta.arg.id;
        state.error = null;
      })
      .addCase(rejectOwnerBooking.fulfilled, (state, action) => {
        state.rejecting = null;
        const idx = state.ownerBookings.findIndex((b) => b.id === action.payload);
        if (idx !== -1) state.ownerBookings[idx].status = 'REJECTED';
        state.success = 'Booking rejected. The user has been notified.';
      })
      .addCase(rejectOwnerBooking.rejected, (state, action) => {
        state.rejecting = null;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError, clearBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
