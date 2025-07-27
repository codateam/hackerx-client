import { UserType } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialAuthState {
  user: UserType | null;
  isAuth: boolean;
  isNewUser: boolean;
  isLoading: boolean;
}

const initialAuthState: InitialAuthState = {
  user: null,
  isAuth: false,
  isNewUser: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state) => {
      state.isLoading = true;
    },
    setUser: (
      state,
      action: PayloadAction<{ user: UserType; isAuth: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAuth = action.payload.isAuth;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
    },
  },
});

export const { login, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
