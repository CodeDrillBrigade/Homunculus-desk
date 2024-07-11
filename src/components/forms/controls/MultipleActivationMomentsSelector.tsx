import { Flex, FormControl, FormLabel, Icon, IconButton, LayoutProps, Select, SpaceProps, Text } from '@chakra-ui/react'
import { Tag } from '../../../models/embed/Tag'
import { FormValue } from '../../../models/form/FormValue'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import { ActivationMoment } from '../../../models/embed/ActivationMoment'
import React, { useCallback, useState } from 'react'
import { WeekDay } from '../../../models/embed/WeekDay'
import { capitalize } from '../../../utils/string-utils'
import { Plus, X } from '@phosphor-icons/react'

interface MultipleActivationMomentsSelectorProps extends SpaceProps, LayoutProps {
	label: string
	defaultValue?: ActivationMoment[]
	validator?: (input?: ActivationMoment[]) => boolean
	valueConsumer?: (value: FormValue<ActivationMoment[]>) => void
	invalidLabel?: string
	controls?: FormControls<ActivationMoment[]>
}

export const MultipleActivationMomentsSelector = ({
	label,
	defaultValue,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: MultipleActivationMomentsSelectorProps) => {
	const { value, setValue } = useFormControl<ActivationMoment[]>({ validator, valueConsumer, defaultValue })
	const setMoments = controls?.setValue ?? setValue
	const moments = controls?.value ?? value
	const [selectedDay, setSelectedDay] = useState(WeekDay.MONDAY)
	const [selectedHour, setSelectedHour] = useState(9)

	const onDaySelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		const day = event.target.selectedOptions[0]?.id
		setSelectedDay(day as WeekDay)
	}, [])

	const onHourSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		const hour = event.target.selectedOptions[0]?.id
		setSelectedHour(Number(hour))
	}, [])

	const onAddMoment = useCallback(() => {
		if (selectedHour >= 0 && selectedHour < 23) {
			setMoments(currentMoments =>
				!!currentMoments && !currentMoments.find(it => it.day === selectedDay && it.hour === selectedHour)
					? [...currentMoments, { day: selectedDay, hour: selectedHour }]
					: [{ day: selectedDay, hour: selectedHour }]
			)
		}
	}, [selectedDay, selectedHour, setMoments])

	const onRemoveMoment = useCallback(
		(moment: ActivationMoment) => {
			setMoments(
				currentMoments => currentMoments?.filter(it => it.day !== moment.day || it.hour !== moment.hour) ?? []
			)
		},
		[setMoments]
	)

	return (
		<FormControl {...style}>
			<FormLabel color={moments.isValid ? '' : 'red'}>{label}</FormLabel>
			<Flex mb="0.5em">
				<Select onChange={onDaySelectChange} defaultValue={selectedDay.valueOf()} width="12em" mr="1em">
					{Object.values(WeekDay).map(it => (
						<option key={`select-${it}`} id={it}>
							{capitalize(it.valueOf())}
						</option>
					))}
				</Select>
				<Select onChange={onHourSelectChange} defaultValue={selectedHour} width="6em" mr="1em">
					{Array.from({ length: 24 }, (_, i) => i).map(it => (
						<option key={`select-${it}`} id={`${it}`}>
							{it}:00
						</option>
					))}
				</Select>
				<IconButton
					colorScheme="green"
					aria-label="Add activation date"
					variant="outline"
					mt="0.2em"
					icon={<Icon as={Plus} weight="bold" boxSize={6} />}
					onClick={onAddMoment}
					size="sm"
				/>
			</Flex>
			{!moments.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
			{moments.value?.map((it, idx) => (
				<Flex key={idx} mb="0.5em">
					<IconButton
						colorScheme="red"
						aria-label="Remove activation date"
						variant="outline"
						mr="0.5em"
						icon={<Icon as={X} weight="bold" boxSize={6} />}
						onClick={() => onRemoveMoment(it)}
						size="sm"
					/>
					<Text fontSize="lg">
						{capitalize(it.day)} {it.hour}:00
					</Text>
				</Flex>
			))}
		</FormControl>
	)
}
