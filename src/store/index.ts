import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from "./auth/auth-slice";
import {authListenerMiddleware} from "./auth/auth-middleware";
import {authAPI} from "../services/auth";
import {storageRoomApi} from "../services/storageRoom";
import {userApi} from "../services/user";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authAPI.reducerPath]: authAPI.reducer,
        [storageRoomApi.reducerPath]: storageRoomApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(authListenerMiddleware.middleware)
            .prepend(authAPI.middleware)
            .prepend(storageRoomApi.middleware)
            .prepend(userApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch