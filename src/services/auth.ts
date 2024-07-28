import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { JwtResponse } from '../models/auth/JwtResponse'
import { LoginData } from '../models/auth/loginData'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}`,
		prepareHeaders: headers => {
			headers.set('content-type', 'application/json')
		},
	}),
	endpoints: builder => ({
		login: builder.mutation<JwtResponse, LoginData>({
			query: data => ({
				url: '/auth/login',
				method: 'POST',
				body: JSON.stringify(data),
			}),
		}),
	}),
})

export const { useLoginMutation } = authApi
