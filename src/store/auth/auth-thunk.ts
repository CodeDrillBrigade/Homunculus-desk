import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState, resetAuthenticationState, setAuthenticationState } from './auth-slice'
import { userApi } from '../../services/user'
import { isJwtInvalidOrExpired } from '../../utils/jwt-utils'
import axios, { AxiosResponse } from 'axios'
import { JwtResponse } from '../../models/auth/JwtResponse'

export const localStorageJwtKey = 'jwt'
export const localStorageRefreshJwtKey = 'refreshJwt'

export const getToken = createAsyncThunk('auth/token', async (_param: void, { getState, dispatch }) => {
	const {
		auth: { jwt },
	} = getState() as { auth: AuthState }

	if (!jwt) {
		const loadedJwt = localStorage.getItem(localStorageJwtKey)
		const refreshJwt = localStorage.getItem(localStorageRefreshJwtKey)
		if (!!refreshJwt && !isJwtInvalidOrExpired(refreshJwt)) {
			const response: AxiosResponse<JwtResponse, any> = await axios.post(
				`${process.env.REACT_APP_APIURL}/auth/refresh`,
				null,
				{
					headers: { Authorization: `Bearer ${refreshJwt}` },
				}
			)
			localStorage.setItem(localStorageJwtKey, response.data.jwt)
			const data = { jwt: response.data.jwt, refreshJwt }
			dispatch(setAuthenticationState(data))
			return data.jwt
		} else {
			const data = { jwt: loadedJwt, refreshJwt }
			if (!!loadedJwt) {
				dispatch(setAuthenticationState(data))
			}
			return data.jwt
		}
	} else {
		return jwt
	}
})

export const resetToken = createAsyncThunk('auth/resetToken', async (_param: void, { dispatch }) => {
	localStorage.removeItem(localStorageJwtKey)
	localStorage.removeItem(localStorageRefreshJwtKey)

	dispatch(userApi.util.resetApiState())
	dispatch(resetAuthenticationState())
})
