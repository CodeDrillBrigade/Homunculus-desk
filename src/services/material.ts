import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { AllMaterialsTag, MaterialTag, materialTagProvider, MaterialTagType } from './tags/material'
import { Material } from '../models/Material'
import { Tag } from '../models/embed/Tag'
import { Filter } from '../models/filter/Filter'

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
			providesTags: materials => materialTagProvider(materials),
		}),
		getMaterial: builder.query<Material, string>({
			query: (materialId: string) => `/${encodeURIComponent(materialId)}`,
			providesTags: material =>
				!!material ? [{ type: MaterialTagType, id: material._id }, AllMaterialsTag] : [AllMaterialsTag],
		}),
		getLastCreated: builder.query<Material[], number>({
			query: (limit: number) => `/recentlyCreated?limit=${limit}`,
			providesTags: materialTagProvider,
		}),
		createMaterial: builder.mutation<string, Partial<Material>>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllMaterialsTag],
		}),
		deleteMaterial: builder.mutation<string, Material>({
			query: material => ({
				url: `/${material._id}`,
				method: 'DELETE',
			}),
			invalidatesTags: id => (!!id ? [{ type: MaterialTagType, id }] : []),
		}),
		modifyMaterial: builder.mutation<void, Material>({
			query: material => ({
				url: '',
				method: 'PUT',
				body: JSON.stringify(material),
			}),
			invalidatesTags: (_, __, material) => materialTagProvider([material]),
		}),
		findMaterialsByFuzzyName: builder.query<Material[], { query: string; limit?: number }>({
			query: ({ query, limit }) => `/byFuzzyName/${encodeURIComponent(query)}${!!limit ? `?limit=${limit}` : ''}`,
			providesTags: materialTagProvider,
		}),
		getMaterialsByRefCode: builder.query<Material[], string>({
			query: refCode => `/byRefCode/${encodeURIComponent(refCode)}`,
			providesTags: materials => materialTagProvider(materials),
		}),
		searchIdsByNameBrandCode: builder.query<string[], { query: string; tags: Tag[] | null }>({
			query: ({ query, tags }) => ({
				url: `/idsByNameBrandCode?query=${encodeURIComponent(query)}`,
				body: JSON.stringify(tags?.map(it => it._id) ?? null),
				method: 'POST',
			}),
			providesTags: ids =>
				!!ids
					? [
							...ids.map(materialId => {
								return { type: MaterialTagType, id: materialId! } as MaterialTag
							}),
							AllMaterialsTag,
					  ]
					: [AllMaterialsTag],
		}),
		searchNamesByNameBrandCode: builder.query<string[], { query: string; limit: number }>({
			query: ({ query, limit }) => ({
				url: `/namesByNameBrandCode?query=${encodeURIComponent(query)}&limit=${limit}`,
				method: 'GET',
			}),
			providesTags: [AllMaterialsTag],
		}),
		getMaterialsByIds: builder.query<Material[], string[]>({
			query: ids => ({
				url: '/byIds',
				body: JSON.stringify(ids),
				method: 'POST',
			}),
			providesTags: materialTagProvider,
		}),
		filterMaterials: builder.query<Material[], Filter>({
			query: filter => ({
				url: '/filter',
				body: JSON.stringify(filter),
				method: 'POST',
			}),
			providesTags: materialTagProvider,
		}),
		initReportCreation: builder.mutation<string, void>({
			query: () => ({
				url: '/report',
				method: 'POST',
				responseHandler: 'text',
			}),
		}),
	}),
})

export const {
	useCreateMaterialMutation,
	useDeleteMaterialMutation,
	useFilterMaterialsQuery,
	useFindMaterialsByFuzzyNameQuery,
	useGetLastCreatedQuery,
	useGetMaterialsByIdsQuery,
	useGetMaterialsByRefCodeQuery,
	useGetMaterialQuery,
	useInitReportCreationMutation,
	useModifyMaterialMutation,
	useSearchIdsByNameBrandCodeQuery,
	useSearchNamesByNameBrandCodeQuery,
} = materialApi

export const useMaterialPrefetch = materialApi.usePrefetch
