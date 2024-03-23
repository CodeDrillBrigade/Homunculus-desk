import {ErrorInfo} from "../../models/errors/ErrorInfo";
import {Alert, AlertDescription, AlertIcon, AlertTitle} from "@chakra-ui/react";

export const ErrorAlert = ({ info }: { info: ErrorInfo }) => {
	return (
		<Alert status='error'>
			<AlertIcon />
			<AlertTitle>{info.label}</AlertTitle>
			<AlertDescription>{JSON.stringify(info.reason)}</AlertDescription>
		</Alert>
	);
}