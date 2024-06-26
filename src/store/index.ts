import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth/auth-slice'
import { authListenerMiddleware } from './auth/auth-middleware'
import { authAPI } from '../services/auth'
import { storageRoomApi } from '../services/storageRoom'
import { metaTagApi } from '../services/tag'
import { boxDefinitionApi } from '../services/boxDefinition'
import { materialApi } from '../services/material'
import { boxApi } from '../services/box'
import { userApi } from '../services/user'
import { processApi } from '../services/process'
import { UIReducer } from './ui/ui-slice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		ui: UIReducer,
		[authAPI.reducerPath]: authAPI.reducer,
		[boxApi.reducerPath]: boxApi.reducer,
		[boxDefinitionApi.reducerPath]: boxDefinitionApi.reducer,
		[materialApi.reducerPath]: materialApi.reducer,
		[metaTagApi.reducerPath]: metaTagApi.reducer,
		[processApi.reducerPath]: processApi.reducer,
		[storageRoomApi.reducerPath]: storageRoomApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.prepend(authListenerMiddleware.middleware)
			.prepend(authAPI.middleware)
			.prepend(boxApi.middleware)
			.prepend(boxDefinitionApi.middleware)
			.prepend(metaTagApi.middleware)
			.prepend(materialApi.middleware)
			.prepend(processApi.middleware)
			.prepend(storageRoomApi.middleware)
			.prepend(userApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
