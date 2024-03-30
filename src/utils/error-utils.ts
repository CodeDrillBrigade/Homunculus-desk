import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";

export function extractErrorMessage(e: FetchBaseQueryError | SerializedError): string {
	return JSON.stringify(e)
}