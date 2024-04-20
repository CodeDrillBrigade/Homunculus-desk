import {
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
import { useFormControl } from '../../../hooks/form'
import React, { useCallback, useEffect, useState } from 'react'
import { Material } from '../../../models/Material'
import { useFindMaterialsByFuzzyNameQuery } from '../../../services/material'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'

interface MaterialSelectorProps extends SpaceProps, LayoutProps {
	label: string
	placeholder: string
	validator?: (input?: Material) => boolean
	valueConsumer?: (value: FormValue<Material>) => void
	invalidLabel?: string
}

export function MaterialSelector({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	...style
}: MaterialSelectorProps) {
	const { value, setValue } = useFormControl<Material>({ validator, valueConsumer })
	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState('')
	const [queryValue, setQueryValue] = useState('')
	const { data, error, isFetching } = useFindMaterialsByFuzzyNameQuery(
		{ query: queryValue, limit: 10 },
		{ skip: queryValue.length <= 0 }
	)

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
			const material = data?.find(it => it._id === id)
			setValue(material)
			if (!!material) {
				setInputValue(material.name)
			}
		},
		[data, setValue]
	)

	const onInputBlur = useCallback(() => {
		const firstId = !!data && data.length > 0 ? data[0]._id : undefined
		handleSelection(firstId)
		popoverClose()
	}, [data, handleSelection, popoverClose])

	const onTabPressed = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Tab') {
				const firstId = !!data && data.length > 0 ? data[0]._id : undefined
				handleSelection(firstId)
				popoverClose()
			}
		},
		[data, handleSelection, popoverClose]
	)

	useEffect(() => {
		setIsTyping(true)
		const timeoutId = setTimeout(() => {
			if (inputValue.trim().length > 0) {
				setQueryValue(inputValue.trim())
			}
			setIsTyping(false)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [inputValue, setQueryValue, setIsTyping])

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'crimson'}>{label}</FormLabel>
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
							borderColor={value.isValid ? '' : 'crimson'}
							borderWidth={value.isValid ? '' : '2px'}
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
							{!!data &&
								inputValue.length > 0 &&
								data.map((it, idx) => (
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
							{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
							{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="crimson">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
