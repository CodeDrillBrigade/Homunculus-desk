import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { UserTagType } from './tags/user'
import { User } from '../models/User'
import { PasswordDto } from '../models/dto/PasswordDto'
import { PERMISSIONS } from '../models/security/Permissions'

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/user`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [UserTagType],
	endpoints: builder => ({
		getUserById: builder.query<User, string>({
			query: userId => `/${userId}`,
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		getPermissions: builder.query<PERMISSIONS[], void>({
			query: () => '/permissions',
		}),
		getUserByEmail: builder.query<User, string>({
			query: email => `/byEmail/${email}`,
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		getUserByUsername: builder.query<User, string>({
			query: username => `/byUsername/${username}`,
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		getCurrentUser: builder.query<User, void>({
			query: () => '',
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		changePassword: builder.mutation<boolean, { userId: string; password: PasswordDto }>({
			query: ({ userId, password }) => ({
				url: `/${userId}/password`,
				method: 'PUT',
				body: JSON.stringify(password),
			}),
			invalidatesTags: (result, _, { userId }) => (result ? [{ type: UserTagType, id: userId }] : []),
		}),
		inviteUser: builder.mutation<string, Partial<User>>({
			query: user => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(user),
				responseHandler: 'text',
			}),
		}),
		modifyUser: builder.mutation<string, Partial<User>>({
			query: user => ({
				url: '',
				method: 'PUT',
				body: JSON.stringify(user),
				responseHandler: 'text',
			}),
			invalidatesTags: (result, _, user) => (!!result ? [{ type: UserTagType, id: user._id }] : []),
		}),
	}),
})

export const {
	useChangePasswordMutation,
	useGetCurrentUserQuery,
	useGetPermissionsQuery,
	useGetUserByIdQuery,
	useInviteUserMutation,
	useLazyGetUserByEmailQuery,
	useLazyGetUserByUsernameQuery,
	useModifyUserMutation,
} = userApi
