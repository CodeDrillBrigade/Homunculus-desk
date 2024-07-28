import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import {
	BoxOnShelfType,
	boxTagOnShelfProvider,
	BoxTagType,
	boxTagWithMaterialProvider,
	BoxWithMaterialType,
} from './tags/box'
import { Box } from '../models/Box'
import { UsageLog } from '../models/embed/UsageLog'

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
	tagTypes: [BoxTagType, BoxOnShelfType, BoxWithMaterialType],
	endpoints: builder => ({
		createBox: builder.mutation<string, Partial<Box>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: (__, _, box) => [
				{ type: BoxOnShelfType, id: box.position! },
				{ type: BoxWithMaterialType, id: box.material! },
			],
		}),
		getBoxByPosition: builder.query<Box[], string>({
			query: (shelfId: string) => `/onShelf/${encodeURIComponent(shelfId)}`,
			providesTags: (boxes, _, shelfId) => boxTagOnShelfProvider(boxes, shelfId),
		}),
		getBoxWithMaterial: builder.query<Box[], string>({
			query: (materialId: string) => `/withMaterial/${encodeURIComponent(materialId)}`,
			providesTags: (boxes, _, materialId) => boxTagWithMaterialProvider(boxes, materialId),
		}),
		deleteBoxesWithMaterial: builder.mutation<Box[], string>({
			query: materialId => ({
				url: `/withMaterial/${encodeURIComponent(materialId)}`,
				method: 'DELETE',
			}),
			invalidatesTags: (deletedBoxes, _, materialId) => {
				if (!!deletedBoxes) {
					const tagsByMaterial = boxTagWithMaterialProvider(deletedBoxes, materialId)
					const tagsByShelf = deletedBoxes.flatMap(it => boxTagOnShelfProvider([it], it.position))
					return tagsByMaterial.concat(tagsByShelf)
				} else {
					return []
				}
			},
		}),
		deleteBox: builder.mutation<string, Box>({
			query: box => ({
				url: `/${box._id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_, __, box) => boxTagOnShelfProvider([box], box.position),
		}),
		updateQuantity: builder.mutation<string, { box: Box; update: UsageLog }>({
			query: ({ box, update }) => ({
				url: `/${box._id}/quantity`,
				method: 'POST',
				body: JSON.stringify(update),
			}),
			invalidatesTags: (_, __, { box }) =>
				boxTagOnShelfProvider([box], box.position).concat(boxTagWithMaterialProvider([box], box.material)),
		}),
		modifyBox: builder.mutation<void, Box>({
			query: box => ({
				url: ``,
				method: 'PUT',
				body: JSON.stringify(box),
			}),
			invalidatesTags: (_, __, box) =>
				boxTagOnShelfProvider([box], box.position).concat(boxTagWithMaterialProvider([box], box.material)),
		}),
	}),
})

export const {
	useCreateBoxMutation,
	useDeleteBoxMutation,
	useDeleteBoxesWithMaterialMutation,
	useGetBoxByPositionQuery,
	useGetBoxWithMaterialQuery,
	useModifyBoxMutation,
	useUpdateQuantityMutation,
} = boxApi
