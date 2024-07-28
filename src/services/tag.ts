import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { AllTags, metaTagTagProvider, TagTagType } from './tags/tag'
import { Tag } from '../models/embed/Tag'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const metaTagApi = createApi({
	reducerPath: 'metaTag',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/tag`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [TagTagType],
	endpoints: builder => ({
		getTags: builder.query<Tag[], void>({
			query: () => '',
			providesTags: metaTagTagProvider,
		}),
		getTagsByIds: builder.query<Tag[], string[]>({
			query: ids => ({
				url: '/byIds',
				body: JSON.stringify(ids),
				method: 'POST',
			}),
			providesTags: metaTagTagProvider,
		}),
		getTag: builder.query<Tag | null, string>({
			queryFn: async (tagId, _, __, baseQuery) => {
				const result = await baseQuery(`/${encodeURIComponent(tagId)}`)
				if (!!result.error && result.error.status === 404) {
					return { data: null }
				} else if (!!result.error) {
					return {
						error: {
							status: result.error?.status,
							data: 'An error occurred',
						} as FetchBaseQueryError,
					}
				} else {
					return { data: result.data as Tag }
				}
			},
			providesTags: tag => metaTagTagProvider(!!tag ? [tag] : undefined),
		}),
		createTag: builder.mutation<string, Partial<Tag>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllTags],
		}),
		deleteTag: builder.mutation<void, string>({
			query: tagId => ({
				url: `/${tagId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_, __, id) => [{ type: TagTagType, id: id }],
		}),
		searchTagIdsByName: builder.query<string[], string>({
			query: query => ({
				url: `/idsByName?query=${encodeURIComponent(query)}`,
			}),
			providesTags: ids =>
				!!ids
					? [
							...ids.map(it => ({ type: TagTagType, id: it } as { type: typeof TagTagType; id: string })),
							AllTags,
					  ]
					: [],
		}),
		modifyTag: builder.mutation<void, Tag>({
			query: data => ({
				url: '',
				method: 'PUT',
				body: JSON.stringify(data),
			}),
			invalidatesTags: (_, __, tag) => (!!tag ? [{ type: TagTagType, id: tag._id }] : []),
		}),
	}),
})

export const {
	useCreateTagMutation,
	useDeleteTagMutation,
	useGetTagsByIdsQuery,
	useGetTagQuery,
	useGetTagsQuery,
	useModifyTagMutation,
	useSearchTagIdsByNameQuery,
} = metaTagApi
