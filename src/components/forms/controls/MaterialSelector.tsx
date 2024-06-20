import {
	Alert,
	AlertIcon,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Kbd,
	LayoutProps,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	SpaceProps,
	Spinner,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import React, { useCallback, useEffect, useState } from 'react'
import { Material } from '../../../models/Material'
import { useFindMaterialsByFuzzyNameQuery, useGetLastCreatedQuery } from '../../../services/material'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'

interface MaterialSelectorProps extends SpaceProps, LayoutProps {
	label?: string
	placeholder: string
	validator?: (input?: Material) => boolean
	valueConsumer?: (value: FormValue<Material>) => void
	invalidLabel?: string
	controls?: FormControls<Material>
}

export function MaterialSelector({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: MaterialSelectorProps) {
	const { value, setValue } = useFormControl<Material>({ validator, valueConsumer })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue
	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string | undefined>(controls?.value?.value?.name)
	const [queryValue, setQueryValue] = useState('')
	const { data: defaultValues } = useGetLastCreatedQuery(5)
	const { data, error, isFetching } = useFindMaterialsByFuzzyNameQuery(
		{ query: queryValue, limit: 10 },
		{ skip: queryValue.length <= 0 }
	)

	const materials = data ?? defaultValues
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!isOpen) {
				popoverOpen()
			}
			const trimmedValue = e.target.value.trim()
			if (trimmedValue.length > 0) {
				setInputValue(e.target.value)
			} else {
				setInputValue('')
			}
		},
		[isOpen, popoverOpen]
	)

	const handleSelection = useCallback(
		(id: string | undefined) => {
			const material = materials?.find(it => it._id === id)
			innerSetValue(material)
			if (!!material) {
				setInputValue(material.name)
			}
		},
		[materials, innerSetValue]
	)

	const onInputBlur = useCallback(() => {
		const firstId = !!materials && materials.length > 0 ? materials[0]._id : undefined
		handleSelection(firstId)
		popoverClose()
	}, [materials, handleSelection, popoverClose])

	const onTabPressed = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Tab') {
				const firstId = !!materials && materials.length > 0 ? materials[0]._id : undefined
				handleSelection(firstId)
				popoverClose()
			}
		},
		[materials, handleSelection, popoverClose]
	)

	useEffect(() => {
		setIsTyping(true)
		const timeoutId = setTimeout(() => {
			if (!!inputValue && inputValue.trim().length > 0) {
				setQueryValue(inputValue.trim())
			}
			setIsTyping(false)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [inputValue, setQueryValue, setIsTyping])

	return (
		<FormControl {...style}>
			{!!label && <FormLabel color={innerValue.isValid ? '' : 'red'}>{label}</FormLabel>}
			<Popover
				closeOnBlur={false}
				closeOnEsc={true}
				isOpen={isOpen}
				onOpen={popoverOpen}
				onClose={popoverClose}
				autoFocus={false}
			>
				<PopoverTrigger>
					<InputGroup>
						<Input
							placeholder={placeholder}
							borderColor={innerValue.isValid ? '' : 'red'}
							borderWidth={innerValue.isValid ? '' : '2px'}
							value={inputValue}
							onChange={handleChange}
							onBlur={onInputBlur}
							onKeyDown={onTabPressed}
						/>
						{isTyping && (
							<InputRightElement>
								<Spinner />
							</InputRightElement>
						)}
					</InputGroup>
				</PopoverTrigger>
				<PopoverContent width="100%">
					<PopoverBody width="90vw">
						<VStack align="flex-start">
							{!!materials &&
								materials.length > 0 &&
								(!inputValue || inputValue.length > 0) &&
								materials.map((it, idx) => (
									<Flex key={it._id} justifyContent="flex-start" marginLeft="1em">
										{idx === 0 && <Kbd marginRight="1em">Tab</Kbd>}
										<Text
											_hover={{ cursor: 'pointer' }}
											onClick={() => {
												handleSelection(it._id)
												popoverClose()
											}}
										>
											{it.name}
										</Text>
									</Flex>
								))}
							{!!materials && materials.length === 0 && (
								<Flex justifyContent="flex-start" marginLeft="1em" width="95%">
									<Alert status="warning" borderRadius="md">
										<AlertIcon />
										There are no materials matching your search
									</Alert>
								</Flex>
							)}
							{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
							{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
