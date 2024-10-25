import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { app } from "src/config/apiClient";

export const login = createAsyncThunk("user/login", async ({ credentials }) => {
  const response = await app.authenticate({
    strategy: "local",
    ...credentials,
  });

  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "",
  },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.status = "";
    },
    clearStatus: (state) => {
      state.status = "";
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.status = "loading";
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "success";
    },
    [login.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

export const { logOut, clearStatus } = userSlice.actions;

export default userSlice.reducer;
