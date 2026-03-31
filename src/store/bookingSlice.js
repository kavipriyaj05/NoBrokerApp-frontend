// Redux Booking Slice — Jeyanth's file
// Manages visit bookings for properties

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

// ─── Slice ────────────────────────────────────────────

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    creating: false,
    cancelling: null,
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
  },
});

export const { clearBookingError, clearBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
