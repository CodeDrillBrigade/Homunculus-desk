
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {User} from "../models/user/user";

export const userApi = createApi(
	{
		reducerPath: "user",
		baseQuery: fetchBaseQuery({
			baseUrl:`${process.env.REACT_APP_APIURL}/user`,
			prepareHeaders: (headers, api)=>
			{
				const {
					auth: { jwt },
				} = api.getState() as { auth: AuthState };
				headers.set("Authorization", `Bearer ${jwt}`);
				headers.set("content-type", "application/json")
			}
		}),
		endpoints: (builder) => ({
			getCurrentUser: builder.query<User,void>({
				query: ()=> ""
			}),
			getPermissions: builder.query<Permissions[],void>({
				query: () => "/permissions"
			})
		})
	}
)

export const {
	useGetCurrentUserQuery,
	useGetPermissionsQuery
} = userApi
