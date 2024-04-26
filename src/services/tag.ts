import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { AllTags, TagTagType } from './tags/tag'
import { Tag } from '../models/embed/Tag'

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
			providesTags: [AllTags],
		}),
		getTag: builder.query<Tag, string>({
			query: (tagId: string) => `/${encodeURIComponent(tagId)}`,
			providesTags: tag => (!!tag ? [{ type: TagTagType, id: tag._id }, AllTags] : [AllTags]),
		}),
		createTag: builder.mutation<string, Tag>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllTags],
		}),
	}),
})

export const { useCreateTagMutation, useGetTagQuery, useGetTagsQuery } = metaTagApi
