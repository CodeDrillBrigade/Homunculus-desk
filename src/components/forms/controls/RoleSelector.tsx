import { Flex, FormControl, FormLabel, LayoutProps, Radio, RadioGroup, SpaceProps, Stack, Text } from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import React from 'react'
import { useFormControl } from '../../../hooks/form-control'
import { useGetRolesQuery } from '../../../services/role'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { Role } from '../../../models/embed/Role'

interface RoleSelectorProps extends LayoutProps, SpaceProps {
	label: string
	validator?: (input?: string) => boolean
	valueConsumer?: (value: FormValue<string>) => void
	invalidLabel?: string
}

function sortById(arr: Role[]): Role[] {
	return [...arr].sort((a, b) => a._id.localeCompare(b._id)).reverse()
}

export const RoleSelector = ({ label, validator, valueConsumer, invalidLabel, ...style }: RoleSelectorProps) => {
	const { data: roles, isLoading, error } = useGetRolesQuery()
	const { value, setValue } = useFormControl<string>({ validator, valueConsumer })

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'red'}>{label}</FormLabel>
			<Flex direction="column">
				{!!error && <ErrorAlert info={{ label: 'Cannot load Roles', reason: error }} />}
				{isLoading && generateSkeletons({ quantity: 3, height: '3em' })}
				{!!roles && (
					<RadioGroup onChange={setValue} value={value.value}>
						<Stack direction="column">
							{sortById(roles).map(role => (
								<Radio key={role._id} value={role._id}>
									<Flex direction="column">
										<Text as="b">{role.name}</Text>
										{value.value === role._id && <Text>{role.description}</Text>}
									</Flex>
								</Radio>
							))}
						</Stack>
					</RadioGroup>
				)}
			</Flex>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
