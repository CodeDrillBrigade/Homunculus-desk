import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { attachmentTagProvider, AttachmentTagType } from './tags/attachment'
import { ProfilePicture } from '../models/ProfilePicture'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const profilePictureApi = createApi({
	reducerPath: 'attachment',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/profilePicture`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
		},
	}),
	tagTypes: [AttachmentTagType],
	endpoints: builder => ({
		getProfilePicture: builder.query<ProfilePicture | null, string>({
			queryFn: async (pictureId, _, __, baseQuery) => {
				const result = await baseQuery(`/${encodeURIComponent(pictureId)}`)
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
					return { data: result.data as ProfilePicture }
				}
			},
			providesTags: picture => (!!picture ? attachmentTagProvider([picture]) : []),
		}),
		createProfilePicture: builder.mutation<string, File>({
			query: data => {
				const bodyFormData = new FormData()
				bodyFormData.append('file', data)
				return {
					url: '',
					method: 'POST',
					body: bodyFormData,
				}
			},
			invalidatesTags: pictureId => (!!pictureId ? [{ type: AttachmentTagType, id: pictureId }] : []),
		}),
		modifyProfilePicture: builder.mutation<void, { picture: File; attachmentId: string }>({
			query: ({ picture, attachmentId }) => {
				const bodyFormData = new FormData()
				bodyFormData.append('file', picture)
				return {
					url: `/${encodeURIComponent(attachmentId)}`,
					method: 'PUT',
					body: bodyFormData,
				}
			},
			invalidatesTags: (_, __, { attachmentId }) => [{ type: AttachmentTagType, id: attachmentId }],
		}),
	}),
})

export const { useCreateProfilePictureMutation, useGetProfilePictureQuery, useModifyProfilePictureMutation } =
	profilePictureApi
