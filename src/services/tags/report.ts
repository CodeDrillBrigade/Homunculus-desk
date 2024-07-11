import { Report } from '../../models/Report'

export type ReportTag = { type: typeof ReportTagType; id: string }
export const ReportTagType = 'Report'
export const AllReportsTag = { type: 'Report' as const, id: 'All' }

export const reportTagProvider: (reports: Report[] | undefined) => ReportTag[] = reports =>
	!!reports
		? [
				...reports.map(report => {
					return { type: ReportTagType, id: report._id } as {
						type: typeof ReportTagType
						id: string
					}
				}),
				AllReportsTag,
		  ]
		: [AllReportsTag]
