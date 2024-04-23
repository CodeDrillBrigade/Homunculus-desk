import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StorageRoom } from '../models/StorageRoom'
import { AllStorageRoomsTag, StorageRoomTagType } from './tags/storageRoom'
import { AuthState } from '../store/auth/auth-slice'
import { Cabinet } from '../models/embed/storage/Cabinet'
import { Shelf } from '../models/embed/storage/Shelf'

export const storageRoomApi = createApi({
	reducerPath: 'storageRoom',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/storage`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [StorageRoomTagType],
	endpoints: builder => ({
		getStorageRooms: builder.query<StorageRoom[], void>({
			query: () => '',
			providesTags: [AllStorageRoomsTag],
		}),
		createStorageRoom: builder.mutation<string, StorageRoom>({
			query: data => ({
				url: '',
				method: 'POST',
				body: JSON.stringify(data),
			}),
			invalidatesTags: [AllStorageRoomsTag],
		}),
		addCabinet: builder.mutation<StorageRoom, { storageRoomId: string; cabinet: Cabinet }>({
			query: data => ({
				url: `/${encodeURIComponent(data.storageRoomId)}/cabinet`,
				method: 'POST',
				body: JSON.stringify(data.cabinet),
			}),
			invalidatesTags: [AllStorageRoomsTag],
		}),
		addShelf: builder.mutation<StorageRoom, { storageRoomId: string; cabinetId: string; shelf: Shelf }>({
			query: data => ({
				url: `/${encodeURIComponent(data.storageRoomId)}/cabinet/${encodeURIComponent(data.cabinetId)}/shelf`,
				method: 'POST',
				body: JSON.stringify(data.shelf),
			}),
			invalidatesTags: [AllStorageRoomsTag],
		}),
	}),
})

export const { useAddCabinetMutation, useAddShelfMutation, useCreateStorageRoomMutation, useGetStorageRoomsQuery } =
	storageRoomApi
