import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { AllMaterialsTag, MaterialTagType } from './tags/material'
import { Material } from '../models/Material'

export const materialApi = createApi({
	reducerPath: 'material',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/material`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [MaterialTagType],
	endpoints: builder => ({
		getMaterials: builder.query<Material[], void>({
			query: () => '',
			providesTags: [AllMaterialsTag],
		}),
		getMaterial: builder.query<Material, string>({
			query: (materialId: string) => `/${encodeURIComponent(materialId)}`,
			providesTags: box =>
				!!box ? [{ type: MaterialTagType, id: box._id }, AllMaterialsTag] : [AllMaterialsTag],
		}),
		createMaterial: builder.mutation<string, Partial<Material>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllMaterialsTag],
		}),
		findMaterialsByFuzzyName: builder.query<Material[], { query: string; limit?: number }>({
			query: ({ query, limit }) => `/byFuzzyName/${encodeURIComponent(query)}${!!limit ? `?limit=${limit}` : ''}`,
		}),
	}),
})

export const {
	useCreateMaterialMutation,
	useGetMaterialQuery,
	useGetMaterialsQuery,
	useFindMaterialsByFuzzyNameQuery,
} = materialApi
