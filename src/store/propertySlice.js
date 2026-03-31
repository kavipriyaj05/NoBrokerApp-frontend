// Redux Property Slice — Jeyanth's file
// Manages property CRUD for owners (add, update, delete, my-properties)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// ─── Thunks ───────────────────────────────────────────

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties/my');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your properties'
      );
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create property'
      );
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update property'
      );
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete property'
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    myProperties: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: null, // holds the id being deleted
    error: null,
    success: null,
  },
  reducers: {
    clearPropertyError(state) {
      state.error = null;
    },
    clearPropertySuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my properties
    builder
      .addCase(fetchMyProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.myProperties = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create property
    builder
      .addCase(createProperty.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.creating = false;
        state.myProperties.unshift(action.payload);
        state.success = 'Property listed successfully!';
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // Update property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.myProperties.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.myProperties[idx] = action.payload;
        state.success = 'Property updated successfully!';
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // Delete property
    builder
      .addCase(deleteProperty.pending, (state, action) => {
        state.deleting = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.deleting = null;
        state.myProperties = state.myProperties.filter((p) => p.id !== action.payload);
        state.success = 'Property deleted successfully!';
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.deleting = null;
        state.error = action.payload;
      });
  },
});

export const { clearPropertyError, clearPropertySuccess } = propertySlice.actions;
export default propertySlice.reducer;
