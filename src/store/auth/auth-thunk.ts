import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState, resetAuthenticationState, setAuthenticationState } from './auth-slice'

export const localStorageJwtKey = 'jwt'
export const localStorageRefreshJwtKey = 'refreshJwt'

export const getToken = createAsyncThunk('auth/token', async (_param: void, { getState, dispatch }) => {
	const {
		auth: { jwt },
	} = getState() as { auth: AuthState }

	if (!jwt) {
		const loadedJwt = localStorage.getItem(localStorageJwtKey)
		const refreshJwt = localStorage.getItem(localStorageRefreshJwtKey)
		const data = { jwt: loadedJwt, refreshJwt }
		if (!!loadedJwt) {
			dispatch(setAuthenticationState(data))
		}
		return data.jwt
	} else {
		return jwt
	}
})

export const resetToken = createAsyncThunk('auth/resetToken', async (_param: void, { dispatch }) => {
	localStorage.removeItem(localStorageJwtKey)
	localStorage.removeItem(localStorageRefreshJwtKey)

	dispatch(resetAuthenticationState())
})
