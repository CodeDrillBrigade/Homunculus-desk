import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { Role } from '../models/embed/Role'
import { RoleTagType } from './tags/role'

export const roleApi = createApi({
	reducerPath: 'roleApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/role`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [RoleTagType],
	endpoints: builder => ({
		getRoles: builder.query<Role[], void>({
			query: () => '',
			providesTags: roles => (!!roles ? roles.map(it => ({ type: RoleTagType, id: it._id })) : []),
		}),
		getRole: builder.query<Role, string>({
			query: (roleId: string) => `/${encodeURIComponent(roleId)}`,
			providesTags: role => (!!role ? [{ type: RoleTagType, id: role._id }] : []),
		}),
	}),
})

export const { useGetRoleQuery, useGetRolesQuery } = roleApi
