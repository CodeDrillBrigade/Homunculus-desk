import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { alertTagProvider, AlertTagType, AllAlertsTag } from './tags/alert'
import { Alert } from '../models/Alert'
import { AllTags } from './tags/tag'

export const alertApi = createApi({
	reducerPath: 'alert',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/alert`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [AlertTagType],
	endpoints: builder => ({
		getAlerts: builder.query<Alert[], void>({
			query: () => '',
			providesTags: [AllAlertsTag],
		}),
		getAlert: builder.query<Alert, string>({
			query: (alertId: string) => `/${encodeURIComponent(alertId)}`,
			providesTags: alert => alertTagProvider(!!alert ? [alert] : undefined),
		}),
		createAlert: builder.mutation<string, Partial<Alert>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllAlertsTag],
		}),
		modifyAlert: builder.mutation<void, Alert>({
			query: data => ({
				url: '',
				method: 'PUT',
				body: JSON.stringify(data),
			}),
			invalidatesTags: (_, __, alert) => (!!alert ? [{ type: AlertTagType, id: alert._id }] : []),
		}),
	}),
})

export const { useCreateAlertMutation, useGetAlertQuery, useGetAlertsQuery, useModifyAlertMutation } = alertApi
