import { useGetCurrentUserQuery } from '../services/user'
import { useGetRoleQuery } from '../services/role'
import { useCallback } from 'react'
import { Permissions } from '../models/security/Permissions'

export function useHasPermission(): (permission: Permissions) => boolean {
	const { data: currentUser } = useGetCurrentUserQuery()
	const { data: currentRole } = useGetRoleQuery(currentUser?.role ?? '', { skip: !currentUser?.role })

	return useCallback(
		(permission: Permissions) => {
			return (
				(currentRole?.permissions?.includes(Permissions.ADMIN) ?? false) ||
				(currentRole?.permissions?.includes(permission) ?? false)
			)
		},
		[currentRole?.permissions]
	)
}
