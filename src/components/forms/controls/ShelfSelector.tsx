import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	FormControl,
	Heading,
	LayoutProps,
	SpaceProps,
	VStack,
	Text,
	Alert,
	AlertIcon,
	FormLabel,
	RadioGroup,
	Radio,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { useGetStorageRoomsQuery } from '../../../services/storageRoom'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'
import React, { useCallback } from 'react'
import { FormControls, useFormControl } from '../../../hooks/form-control'

interface ShelfSelectorProps extends SpaceProps, LayoutProps {
	label: string
	validator?: (input?: string) => boolean
	valueConsumer?: (value: FormValue<string>) => void
	invalidLabel?: string
	controls?: FormControls<string>
}

export const ShelfSelector = ({
	label,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: ShelfSelectorProps) => {
	const { value, setValue } = useFormControl<string>({ validator, valueConsumer })
	const { data, error, isFetching } = useGetStorageRoomsQuery()
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue

	const onRadioChange = useCallback(
		(selectedId: string) => {
			innerSetValue(selectedId)
		},
		[innerSetValue]
	)

	return (
		<FormControl {...style}>
			<FormLabel color={innerValue.isValid ? '' : 'crimson'}>{label}</FormLabel>
			<VStack>
				{!!data && (
					<RadioGroup width="100%" value={innerValue.value ?? ''} onChange={onRadioChange}>
						{' '}
						<Accordion allowToggle>
							{data.map(room => (
								<AccordionItem key={room._id}>
									<AccordionButton>
										<AccordionIcon />
										<Heading size="md">{room.name}</Heading>
									</AccordionButton>
									<AccordionPanel>
										{(!room.cabinets || room.cabinets.length === 0) && (
											<Alert status="warning">
												<AlertIcon />
												There are no cabinets in this room
											</Alert>
										)}
										{!!room.cabinets && room.cabinets.length > 0 && (
											<Accordion allowToggle>
												{room.cabinets.map(cabinet => (
													<AccordionItem key={cabinet.id}>
														<AccordionButton>
															<AccordionIcon />
															<Heading size="md">{cabinet.name}</Heading>
														</AccordionButton>
														<AccordionPanel>
															{(!cabinet.shelves || cabinet.shelves.length === 0) && (
																<Alert status="warning">
																	<AlertIcon />
																	There are no shelves in this cabinet
																</Alert>
															)}
															{!!cabinet.shelves && cabinet.shelves.length > 0 && (
																<VStack align="flex-start">
																	{cabinet.shelves.map(shelf => (
																		<Radio
																			key={shelf.id}
																			value={`${room._id}|${cabinet.id}|${shelf.id}`}
																		>
																			{shelf.name}
																		</Radio>
																	))}
																</VStack>
															)}
														</AccordionPanel>
													</AccordionItem>
												))}
											</Accordion>
										)}
									</AccordionPanel>
								</AccordionItem>
							))}
						</Accordion>
					</RadioGroup>
				)}
				{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
				{!!error && <ErrorAlert info={{ label: 'Cannot load rooms', reason: error }} />}
				{!innerValue.isValid && !!invalidLabel && (
					<Text fontSize="sm" color="crimson">
						{invalidLabel}
					</Text>
				)}
			</VStack>
		</FormControl>
	)
}
