import { TypedStartListening, createListenerMiddleware } from '@reduxjs/toolkit'
import { resetAuthenticationState, setAuthenticationState } from './auth-slice'
import { AppDispatch, RootState } from '..'
import { getJwtExpirationMillis, isJwtInvalidOrExpired } from '../../utils/jwt-utils'
import axios, { AxiosResponse } from 'axios'
import { JwtResponse } from '../../models/auth/JwtResponse'
import { localStorageJwtKey, localStorageRefreshJwtKey } from './auth-thunk'

export const authListenerMiddleware = createListenerMiddleware()

type authListeningMiddlewareType = TypedStartListening<RootState, AppDispatch>

const startAuthListening = authListenerMiddleware.startListening as authListeningMiddlewareType

startAuthListening({
	actionCreator: setAuthenticationState,
	effect: async (action, listenerApi) => {
		listenerApi.cancelActiveListeners()

		const { jwt, refreshJwt } = action.payload
		const expirationDelay = !!jwt ? getJwtExpirationMillis(jwt) - new Date().getTime() - 10000 : 0
		await listenerApi.delay(expirationDelay)

		if (!!refreshJwt && !isJwtInvalidOrExpired(refreshJwt)) {
			await axios
				.post(`${process.env.REACT_APP_APIURL}/auth/refresh`, null, {
					headers: { Authorization: `Bearer ${refreshJwt}` },
				})
				.then(
					(response: AxiosResponse<JwtResponse, any>) => {
						listenerApi.dispatch(
							setAuthenticationState({
								jwt: response.data.jwt,
								refreshJwt: null,
							})
						)
					},
					() => {
						localStorage.removeItem(localStorageJwtKey)
						localStorage.removeItem(localStorageRefreshJwtKey)
						listenerApi.dispatch(resetAuthenticationState())
					}
				)
		} else {
			localStorage.removeItem(localStorageJwtKey)
			localStorage.removeItem(localStorageRefreshJwtKey)
			listenerApi.dispatch(resetAuthenticationState())
		}
	},
})
