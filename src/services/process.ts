import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const processApi = createApi({
	reducerPath: 'processApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}`,
		prepareHeaders: headers => {
			headers.set('content-type', 'application/json')
		},
	}),
	endpoints: builder => ({
		resetPasswordRequest: builder.mutation<void, string>({
			query: email => ({
				url: `/process/passwordReset?email=${encodeURIComponent(email)}`,
				method: 'POST',
				responseHandler: 'text',
			}),
		}),
		resetPasswordConfirm: builder.query<string, string>({
			query: secret => ({
				url: `/process/restConfirm?secret=${encodeURIComponent(secret)}`,
				method: 'POST',
				responseHandler: 'text',
			}),
		}),
	}),
})

export const { useResetPasswordRequestMutation, useResetPasswordConfirmQuery } = processApi
