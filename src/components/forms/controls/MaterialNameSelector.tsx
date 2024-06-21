import {
	Alert,
	AlertIcon,
	Box,
	Container,
	Divider,
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
import { useSearchNamesByNameBrandCodeQuery } from '../../../services/material'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'

interface MaterialNameSelectorProps extends SpaceProps, LayoutProps {
	label?: string
	placeholder: string
	validator?: (input?: string) => boolean
	valueConsumer?: (value: FormValue<string>) => void
	invalidLabel?: string
	controls?: FormControls<string>
}

export function MaterialNameSelector({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: MaterialNameSelectorProps) {
	const { value, setValue } = useFormControl({ validator, valueConsumer })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue
	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string | undefined>(controls?.value?.value)
	const [queryValue, setQueryValue] = useState('')
	const { data, error, isFetching } = useSearchNamesByNameBrandCodeQuery({ query: queryValue, limit: 5 })

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
		(name: string | undefined) => {
			innerSetValue(name ?? inputValue)
			if (!!name) {
				setInputValue(name)
			}
		},
		[innerSetValue, inputValue]
	)

	const onTabPressed = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Tab') {
				const name = !!data && data.length > 0 ? data[0] : undefined
				console.log(name)
				handleSelection(name)
				popoverClose()
			}
		},
		[data, handleSelection, popoverClose]
	)

	const onElementClicked = useCallback(
		(value: string) => {
			handleSelection(value)
			popoverClose()
		},
		[handleSelection, popoverClose]
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
							onBlur={popoverClose}
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
					<PopoverBody width="70vw">
						<VStack align="flex-start">
							{!!data &&
								data.length > 0 &&
								(!inputValue || inputValue.length > 0) &&
								data.map((it, idx) => (
									<Box key={it} width="full">
										<Flex
											justifyContent="flex-start"
											marginLeft="1em"
											onClick={() => onElementClicked(it)}
											width="full"
											_hover={{ cursor: 'pointer' }}
										>
											{idx === 0 && <Kbd marginRight="1em">Tab</Kbd>}
											<Text>{it}</Text>
										</Flex>
										<Divider mt="0.5em" ml="1em" width="98%" />
									</Box>
								))}
							{!!data && data.length === 0 && (
								<Flex justifyContent="flex-start" marginLeft="1em" width="95%">
									<Alert status="info" borderRadius="md">
										<AlertIcon />
										You are creating a new name: {inputValue}
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
