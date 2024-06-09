const dayMillis = 1000 * 60 * 60 * 24

export function daysToToday(timestamp: number): number {
	const currentDate = new Date()

	// Calculate the difference in milliseconds
	const diffInMilliseconds = timestamp - currentDate.getTime()

	// Convert milliseconds to days and round to nearest whole number
	return Math.floor(diffInMilliseconds / dayMillis)
}

export function toDayMonthYear(timestamp: number | undefined | null): string {
	if (!timestamp) return ''
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear().toString()

	return `${day}-${month}-${year}`
}
