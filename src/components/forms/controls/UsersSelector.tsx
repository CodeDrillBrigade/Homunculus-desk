import {
	Box,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
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
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { User } from '../../../models/User'
import { useGetUsersByUsernameEmailNameQuery } from '../../../services/user'
import { X } from '@phosphor-icons/react'
import { UserAvatar } from '../../ui/UserAvatar'

interface UsersSelectorProps extends SpaceProps, LayoutProps {
	label?: string
	placeholder: string
	defaultValue?: User[]
	validator?: (input?: User[]) => boolean
	valueConsumer?: (value: FormValue<User[]>) => void
	invalidLabel?: string
	controls?: FormControls<User[]>
}

export function UsersSelector({
	label,
	placeholder,
	defaultValue,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: UsersSelectorProps) {
	const { value, setValue } = useFormControl({ defaultValue, validator, valueConsumer })
	const users = controls?.value ?? value
	const setUsers = controls?.setValue ?? setValue
	const [isTyping, setIsTyping] = useState(false)
	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const [inputValue, setInputValue] = useState<string>('')
	const [queryValue, setQueryValue] = useState('')
	const { data, error, isFetching } = useGetUsersByUsernameEmailNameQuery({ query: queryValue, onlyActive: true })

	const handleRemoval = useCallback(
		(userId: string) => {
			setUsers(currentValue => [...(currentValue ?? [])].filter(it => it._id !== userId))
		},
		[setUsers]
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
		(userId: string) => {
			const newUser = data?.find(user => user._id === userId)
			setUsers(currentValues => {
				if (!!newUser && !currentValues?.find(user => user._id === newUser._id)) {
					return [...(currentValues ?? []), newUser]
				} else {
					return currentValues ?? []
				}
			})
			setInputValue('')
		},
		[data, setUsers]
	)

	const onElementClicked = useCallback(
		(userId: string) => {
			handleSelection(userId)
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
			{!!label && <FormLabel color={users.isValid ? '' : 'red'}>{label}</FormLabel>}
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
							borderColor={users.isValid ? '' : 'red'}
							borderWidth={users.isValid ? '' : '2px'}
							value={inputValue}
							onChange={handleChange}
							onBlur={popoverClose}
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
								data.map(it => (
									<Box key={it._id} width="full">
										<Flex
											justifyContent="flex-start"
											marginLeft="1em"
											onClick={() => onElementClicked(it._id)}
											width="full"
											_hover={{ cursor: 'pointer' }}
										>
											<Text>
												{!!it.name || it.surname
													? `${it.name + ' ' ?? ''}${it.surname ?? ''}`
													: it.username}
											</Text>
										</Flex>
										<Divider mt="0.5em" ml="1em" width="98%" />
									</Box>
								))}
							{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
							{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
			<Flex padding="0.6em" margin="0px" direction="column">
				{(users.value ?? []).map(user => (
					<Flex key={user._id}>
						<IconButton
							colorScheme="red"
							aria-label="Remove user"
							variant="outline"
							mr="0.6em"
							mt="0.2em"
							size="sm"
							icon={<Icon as={X} weight="bold" boxSize={5} />}
							onClick={() => {
								handleRemoval(user._id)
							}}
						/>
						<UserAvatar user={user} showWarning={false} boxSize={10} />
						<Text fontSize="lg" ml="0.6em" mt="0.3em">
							{!!user.name || user.surname
								? `${user.name + ' ' ?? ''}${user.surname ?? ''}`
								: user.username}
						</Text>
					</Flex>
				))}
			</Flex>
			{!users.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
