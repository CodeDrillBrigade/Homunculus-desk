export function getReportDownloadUrl(token: string): string {
	return `${process.env.REACT_APP_APIURL}/material/report?token=${token}`
}
