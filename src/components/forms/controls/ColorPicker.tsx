import {
	Button,
	Center,
	FormControl,
	FormLabel,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	SimpleGrid,
	SpaceProps,
	Text,
} from '@chakra-ui/react'
import React from 'react'
import { FormValue } from '../../../models/form/FormValue'
import { getRandomDarkHexColor } from '../../../utils/style-utils'
import { Repeat } from '@phosphor-icons/react'
import { FormControls, useFormControl } from '../../../hooks/form-control'

interface ColorPickerProps extends SpaceProps {
	label: string
	colors: string[]
	initialColor?: string
	valueConsumer?: (value: FormValue<string>) => void
	controls?: FormControls<string>
}

export const ColorPicker = ({ label, colors, valueConsumer, initialColor, controls, ...style }: ColorPickerProps) => {
	const { value, setValue } = useFormControl<string>({
		validator: input => !!input && RegExp('^#[a-fA-F0-9]{6}$').test(input),
		valueConsumer,
		defaultValue: initialColor ?? getRandomDarkHexColor(),
	})

	const color = controls?.value ?? value
	const setColor = controls?.setValue ?? setValue

	const handleChange = (event: string) => {
		setColor(event.trim())
	}

	const setRandomColor = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		handleChange(getRandomDarkHexColor())
		event.stopPropagation()
	}

	return (
		<FormControl {...style}>
			<FormLabel color={color.isValid ? '' : 'crimson'} alignSelf="left">
				{label}
			</FormLabel>
			<Popover variant="picker">
				<PopoverTrigger>
					<InputGroup>
						<InputLeftAddon bg={color.value} />
						<Input
							variant="filled"
							value={color.value}
							width="auto"
							isReadOnly={true}
							focusBorderColor="gray.200"
						/>
						<InputRightAddon>
							<IconButton
								aria-label="Generate random color"
								icon={<Icon as={Repeat} weight="bold" boxSize={5} />}
								onClick={setRandomColor}
								background="unset"
								_hover={{ background: 'transparent' }}
							/>
						</InputRightAddon>
					</InputGroup>
				</PopoverTrigger>
				<PopoverContent width="170px">
					<PopoverArrow bg={color.value} />
					<PopoverCloseButton color="white" />
					<PopoverHeader
						height="100px"
						backgroundColor={color.value}
						borderTopLeftRadius={5}
						borderTopRightRadius={5}
						color="white"
					>
						<Center height="100%">{color.value}</Center>
					</PopoverHeader>
					<PopoverBody height="120px">
						<SimpleGrid columns={5} spacing={2}>
							{colors.map(c => (
								<Button
									key={c}
									aria-label={c}
									background={c}
									height="22px"
									width="22px"
									padding={0}
									minWidth="unset"
									borderRadius={3}
									_hover={{ background: c }}
									onClick={() => {
										handleChange(c)
									}}
								></Button>
							))}
						</SimpleGrid>
						<Input
							borderRadius={3}
							marginTop={3}
							placeholder="red.100"
							size="sm"
							value={color.value}
							onChange={e => {
								handleChange(e.target.value)
							}}
						/>
					</PopoverBody>
				</PopoverContent>
			</Popover>
			{!color.isValid && (
				<Text fontSize="sm" color="crimson">
					Not a valid HEX color.
				</Text>
			)}
		</FormControl>
	)
}
