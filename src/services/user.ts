import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { UserTagType } from './tags/user'
import { User } from '../models/User'
import { PasswordDto } from '../models/dto/PasswordDto'

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
		getUserByEmail: builder.query<User, { email: string; excludeRegistering?: boolean }>({
			query: ({ email, excludeRegistering }) =>
				`/byEmail/${email}${!!excludeRegistering ? `&excludeRegistering=${excludeRegistering}` : ''}`,
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
		modifyUserRole: builder.mutation<void, { userId: string; roleId: string }>({
			query: ({ userId, roleId }) => ({
				url: `/${encodeURIComponent(userId)}/role/${encodeURIComponent(roleId)}`,
				method: 'PUT',
			}),
			invalidatesTags: (_, __, { userId }) => [{ type: UserTagType, id: userId }],
		}),
		getUsersByUsernameEmailName: builder.query<User[], string>({
			query: query => `/byUsernameEmailName?query=${encodeURIComponent(query)}`,
			providesTags: users => (!!users ? users.map(user => ({ type: UserTagType, id: user._id })) : []),
		}),
		getUsersByIds: builder.query<User[], string[]>({
			query: userIds => ({
				url: '/byIds',
				method: 'POST',
				body: JSON.stringify(userIds),
			}),
			providesTags: users => (!!users ? users.map(user => ({ type: UserTagType, id: user._id })) : []),
		}),
	}),
})

export const {
	useChangePasswordMutation,
	useGetCurrentUserQuery,
	useGetUserByIdQuery,
	useGetUsersByIdsQuery,
	useGetUsersByUsernameEmailNameQuery,
	useInviteUserMutation,
	useLazyGetUserByEmailQuery,
	useLazyGetUserByUsernameQuery,
	useModifyUserMutation,
	useModifyUserRoleMutation,
} = userApi
