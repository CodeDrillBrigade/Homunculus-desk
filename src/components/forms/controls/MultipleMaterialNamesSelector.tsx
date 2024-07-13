import {
	Alert,
	AlertIcon,
	Box,
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
	TagCloseButton,
	TagLabel,
	Text,
	useBreakpointValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchNamesByNameBrandCodeQuery } from '../../../services/material'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { Tag as TagComponent } from '@chakra-ui/react'
import { Size } from './TagInput'
import { chunkArray } from '../../../utils/array-utils'

interface MultipleMaterialNamesSelectorProps extends SpaceProps, LayoutProps {
	label?: string
	placeholder: string
	validator?: (input?: string[]) => boolean
	valueConsumer?: (value: FormValue<string[]>) => void
	defaultValue?: string[]
	invalidLabel?: string
	controls?: FormControls<string[]>
}

const namesForSize: Record<Size, { names: number }> = {
	xl: { names: 8 },
	lg: { names: 8 },
	md: { names: 6 },
	sm: { names: 3 },
	base: { names: 3 },
}

export function MultipleMaterialNamesSelector({
	label,
	placeholder,
	validator,
	valueConsumer,
	defaultValue,
	invalidLabel,
	controls,
	...style
}: MultipleMaterialNamesSelectorProps) {
	const size = useBreakpointValue<{ names: number }>(namesForSize, {
		fallback: 'md',
	})
	const { value, setValue } = useFormControl({ validator, valueConsumer, defaultValue })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue
	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string | undefined>(undefined)
	const [queryValue, setQueryValue] = useState('')
	const { data, error, isFetching } = useSearchNamesByNameBrandCodeQuery({ query: queryValue, limit: 5 })

	const handleRemoval = useCallback(
		(name: string) => {
			innerSetValue(currentValue => [...(currentValue ?? [])].filter(it => it !== name))
		},
		[innerSetValue]
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
		(name: string | undefined) => {
			innerSetValue(currentValues => {
				if (!!name && currentValues?.includes(name) !== true) {
					return [...(currentValues ?? []), name]
				} else {
					return currentValues ?? []
				}
			})
			setInputValue('')
		},
		[innerSetValue]
	)

	const onTabPressed = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Tab') {
				const name = !!data && data.length > 0 ? data[0] : undefined
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

	const chunkSelected = chunkArray(innerValue?.value ?? [], size?.names ?? 5)
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
			<Flex padding="0.6em" margin="0px">
				<VStack align="stretch">
					{chunkSelected.map((chunk, idx) => (
						<Flex key={`names-selected-flex-${idx}`} marginBottom="0.6em" align="center" justify="start">
							{chunk.map(name => (
								<TagComponent
									size="md"
									key={name}
									borderRadius="full"
									variant="solid"
									bg="#3182ce"
									marginLeft="0.6em"
								>
									<TagLabel>{name}</TagLabel>
									<TagCloseButton onClick={() => handleRemoval(name)} />
								</TagComponent>
							))}
						</Flex>
					))}
				</VStack>
			</Flex>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
