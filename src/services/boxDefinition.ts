import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AuthState} from "../store/auth/auth-slice";
import {AllBoxDefinitionsTag, BoxDefinitionTagType} from "./tags/boxDefinition";
import {BoxDefinition} from "../models/embed/BoxDefinition";

export const boxDefinitionApi = createApi({
	reducerPath: "boxDefinition",
	baseQuery:fetchBaseQuery({
		baseUrl:`${process.env.REACT_APP_APIURL}/boxDefinition`,
		prepareHeaders: (headers, api)=>
		{
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState };
			headers.set("Authorization", `Bearer ${jwt}`);
			headers.set("content-type", "application/json")
		}
	}),
	tagTypes: [BoxDefinitionTagType],
	endpoints: (builder) => ({
		getBoxDefinitions: builder.query<BoxDefinition[], void>({
			query: () => "",
			providesTags: [AllBoxDefinitionsTag]
		}),
		getBoxDefinition: builder.query<BoxDefinition, string>({
			query: (tagId: string) => `/${tagId}`,
			providesTags: (box) => !!box ? [{ type: BoxDefinitionTagType, id: box._id }, AllBoxDefinitionsTag] : [AllBoxDefinitionsTag]
		}),
		createBoxDefinition: builder.mutation<string, BoxDefinition>({
			query: (data) => ({
				url: "",
				method: "PUT",
				body: JSON.stringify(data)
			}),
			invalidatesTags: [AllBoxDefinitionsTag]
		})
	})
})

export const {
	useCreateBoxDefinitionMutation,
	useGetBoxDefinitionQuery,
	useGetBoxDefinitionsQuery
} = boxDefinitionApi
