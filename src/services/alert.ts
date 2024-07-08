import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { alertTagProvider, AlertTagType, AllAlertsTag } from './tags/alert'
import { Alert } from '../models/Alert'
import { AlertStatus } from '../models/embed/AlertStatus'

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
		getAlertsByIds: builder.query<Alert[], string[]>({
			query: ids => ({
				url: '/byIds',
				body: JSON.stringify(ids),
				method: 'POST',
			}),
			providesTags: alertTagProvider,
		}),
		searchIdsByName: builder.query<string[], string>({
			query: query => ({
				url: `/idsByName?query=${encodeURIComponent(query)}`,
			}),
			providesTags: ids =>
				!!ids
					? [
							...ids.map(
								it => ({ type: AlertTagType, id: it } as { type: typeof AlertTagType; id: string })
							),
							AllAlertsTag,
					  ]
					: [AllAlertsTag],
		}),
		setAlertStatus: builder.mutation<void, { alertId: string; status: AlertStatus }>({
			query: ({ alertId, status }) => ({
				url: `/${alertId}/status?status=${status}`,
				method: 'PUT',
			}),
			invalidatesTags: (_, __, { alertId }) => [{ type: AlertTagType, id: alertId }],
		}),
		deleteAlert: builder.mutation<void, string>({
			query: alertId => ({
				url: `/${alertId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_, __, alertId) => [{ type: AlertTagType, id: alertId }],
		}),
	}),
})

export const {
	useCreateAlertMutation,
	useDeleteAlertMutation,
	useGetAlertsByIdsQuery,
	useGetAlertQuery,
	useGetAlertsQuery,
	useModifyAlertMutation,
	useSearchIdsByNameQuery,
	useSetAlertStatusMutation,
} = alertApi

export const useAlertPrefetch = alertApi.usePrefetch
