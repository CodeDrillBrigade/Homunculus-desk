import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {StorageRoom} from "../models/StorageRoom";
import {AllStorageRoomsTag, StorageRoomTagType} from "./tags/storageRoom";
import {AuthState} from "../store/auth/auth-slice";

export const storageRoomApi = createApi({
	reducerPath:"storageRoom",
	baseQuery:fetchBaseQuery({
		baseUrl:`${process.env.REACT_APP_APIURL}/storage`,
		prepareHeaders: (headers, api)=>
		{
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState };
			headers.set("Authorization", `Bearer ${jwt}`);
			headers.set("content-type", "application/json")
		}
	}),
	tagTypes: [StorageRoomTagType],
	endpoints: (builder) => ({
		getStorageRooms: builder.query<StorageRoom[], void>({
			query: () => "",
			providesTags: [AllStorageRoomsTag]
		}),
		createStorageRoom: builder.mutation<string, StorageRoom>({
			query: (data) => ({
				url: "",
				method: "POST",
				body: JSON.stringify(data)
			}),
			invalidatesTags: [AllStorageRoomsTag]
		})
	})
})

export const {
	useCreateStorageRoomMutation,
	useGetStorageRoomsQuery
} = storageRoomApi
