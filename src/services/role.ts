import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Role} from "../models/Role";
import {AuthState} from "../store/auth/auth-slice";
import {AllRolesTag, RoleTagType} from "./tags/role";

export const rolePageApi = createApi(
	{
		reducerPath: "role",
		baseQuery: fetchBaseQuery({
			baseUrl: `${process.env.REACT_APP_APIURL}/role`,
			prepareHeaders: (headers, api)=> {
				const {
					auth: { jwt },
				} = api.getState() as { auth: AuthState }
				headers.set('Authorization', `Bearer ${jwt}`)
				headers.set('content-type', 'application/json')
			}
		}),
		tagTypes:[RoleTagType],
		endpoints: (builder) => ({
			getAllRoles: builder.query<Role[],void>({
				query: ()=> "",
				providesTags: [AllRolesTag]
			}),
			getRole: builder.query<Role,string>({
				query: (id) => `/${id}`
			}),
			addRole: builder.mutation<string, Partial<Role>>({
				query: (role) => {
					console.log(`Role: ${role.name} ${role.description} ${role.permissions}`)
					return {url: "", method: "POST", body: JSON.stringify(role)}
				},
				invalidatesTags: [AllRolesTag]
			})
		})
	}
)

// query -> prendono dal backend senza modificare stato
// mutation -> modificano lo stato

export const {
	useGetAllRolesQuery,
	useGetRoleQuery,
	useAddRoleMutation
} = rolePageApi
