import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, ProfileState } from "../../types/index";

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchProfileSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.profile = action.payload;
    },

    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.profile = action.payload;
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearProfileError: (state) => {
      state.error = null;
    },

    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfileError,
  setProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
