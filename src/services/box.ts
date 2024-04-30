import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { BoxOnShelfType, BoxTagType } from './tags/box'
import { Box } from '../models/Box'

export const boxApi = createApi({
	reducerPath: 'box',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/box`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [BoxTagType, BoxOnShelfType],
	endpoints: builder => ({
		createBox: builder.mutation<string, Partial<Box>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: (__, _, box) => [{ type: BoxOnShelfType, id: box.position }],
		}),
		getBoxByPosition: builder.query<Box[], string>({
			query: (shelfId: string) => `/onShelf/${encodeURIComponent(shelfId)}`,
			providesTags: (boxes, _, shelfId) =>
				!!boxes
					? [
							...boxes.map(box => {
								return { type: BoxTagType, id: box._id! } as { type: typeof BoxTagType; id: string }
							}),
							{ type: BoxOnShelfType, id: shelfId },
					  ]
					: [{ type: BoxOnShelfType, id: shelfId }],
		}),
		deleteBox: builder.mutation<string, Box>({
			query: box => ({
				url: `/${box._id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (id, _, box) =>
				!!id
					? [
							{ type: BoxOnShelfType, id: box.position },
							{ type: BoxTagType, id: id },
					  ]
					: [],
		}),
	}),
})

export const { useCreateBoxMutation, useDeleteBoxMutation, useGetBoxByPositionQuery } = boxApi
