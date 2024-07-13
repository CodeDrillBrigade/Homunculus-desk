import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { AllReportsTag, reportTagProvider, ReportTagType } from './tags/report'
import { Report } from '../models/Report'
import { ReportStatus } from '../models/embed/ReportStatus'
import { NotificationStub } from '../models/dto/NotificationStub'

export const reportApi = createApi({
	reducerPath: 'report',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/report`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [ReportTagType],
	endpoints: builder => ({
		getReports: builder.query<Report[], void>({
			query: () => '',
			providesTags: [AllReportsTag],
		}),
		getReport: builder.query<Report, string>({
			query: (reportId: string) => `/${encodeURIComponent(reportId)}`,
			providesTags: report => reportTagProvider(!!report ? [report] : undefined),
		}),
		createReport: builder.mutation<string, Partial<Report>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllReportsTag],
		}),
		modifyReport: builder.mutation<void, Partial<Report>>({
			query: data => ({
				url: '',
				method: 'PUT',
				body: JSON.stringify(data),
			}),
			invalidatesTags: (_, __, report) => (!!report ? [{ type: ReportTagType, id: report._id }] : []),
		}),
		getReportsByIds: builder.query<Report[], string[]>({
			query: ids => ({
				url: '/byIds',
				body: JSON.stringify(ids),
				method: 'POST',
			}),
			providesTags: reportTagProvider,
		}),
		searchReportIdsByName: builder.query<string[], string>({
			query: query => ({
				url: `/idsByName?query=${encodeURIComponent(query)}`,
			}),
			providesTags: ids =>
				!!ids
					? [
							...ids.map(
								it => ({ type: ReportTagType, id: it } as { type: typeof ReportTagType; id: string })
							),
							AllReportsTag,
					  ]
					: [AllReportsTag],
		}),
		setReportStatus: builder.mutation<void, { reportId: string; status: ReportStatus }>({
			query: ({ reportId, status }) => ({
				url: `/${reportId}/status?status=${status}`,
				method: 'PUT',
			}),
			invalidatesTags: (_, __, { reportId }) => [{ type: ReportTagType, id: reportId }],
		}),
		deleteReport: builder.mutation<void, string>({
			query: reportId => ({
				url: `/${reportId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_, __, reportId) => [{ type: ReportTagType, id: reportId }],
		}),
		getReportsByActivationMaterial: builder.query<NotificationStub[], string>({
			query: materialId => `/byActivationMaterial?materialId=${materialId}`,
			providesTags: stubs =>
				!!stubs
					? [
							...stubs.map(
								it => ({ type: ReportTagType, id: it.id } as { type: typeof ReportTagType; id: string })
							),
							AllReportsTag,
					  ]
					: [],
		}),
		addMaterialToReportsExclusions: builder.mutation<Report[], { materialId: string; reportIds: string[] }>({
			query: ({ materialId, reportIds }) => ({
				url: `/addToExclusions?materialId=${materialId}`,
				method: 'POST',
				body: JSON.stringify(reportIds),
			}),
			invalidatesTags: (_, __, { reportIds }) =>
				!!reportIds
					? reportIds.map(
							it => ({ type: ReportTagType, id: it } as { type: typeof ReportTagType; id: string })
					  )
					: [],
		}),
	}),
})

export const {
	useAddMaterialToReportsExclusionsMutation,
	useCreateReportMutation,
	useDeleteReportMutation,
	useLazyGetReportsByActivationMaterialQuery,
	useGetReportsByIdsQuery,
	useModifyReportMutation,
	useSearchReportIdsByNameQuery,
	useSetReportStatusMutation,
} = reportApi

export const useReportPrefetch = reportApi.usePrefetch
