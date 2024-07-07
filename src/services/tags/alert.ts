import { Alert } from '../../models/Alert'

export type AlertTag = { type: typeof AlertTagType; id: string }
export const AlertTagType = 'Alert'
export const AllAlertsTag = { type: 'Alert' as const, id: 'All' }

export const alertTagProvider: (materials: Alert[] | undefined) => AlertTag[] = alerts =>
	!!alerts
		? [
				...alerts.map(alert => {
					return { type: AlertTagType, id: alert._id } as {
						type: typeof AlertTagType
						id: string
					}
				}),
				AllAlertsTag,
		  ]
		: [AllAlertsTag]
