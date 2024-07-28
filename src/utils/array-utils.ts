export function chunkArray<T>(array: T[], size: number): T[][] {
	const result: T[][] = []
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size))
	}
	return result
}

export const getIdsInPage = (ids: string[] | undefined, pageIdx: number, pageSize: number) =>
	ids?.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize) ?? []

export function getEntitiesInPage<T>(entities: T[] | undefined, pageIdx: number, pageSize: number): T[] {
	return entities?.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize) ?? []
}
