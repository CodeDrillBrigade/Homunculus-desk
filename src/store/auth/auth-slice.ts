import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    refreshJwt: string | null;
    jwt: string | null;
}

const initialState: AuthState = {
    refreshJwt: null,
    jwt: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuthenticationState: (state, action: PayloadAction<AuthState>) => {
            state.jwt = action.payload.jwt;
            state.refreshJwt = action.payload.refreshJwt;
        },
        resetAuthenticationState: (state) => {
            state.jwt = null;
            state.refreshJwt = null;
        }
    }
})

export const {
    resetAuthenticationState,
    setAuthenticationState
} = authSlice.actions;

export const authReducer = authSlice.reducer;