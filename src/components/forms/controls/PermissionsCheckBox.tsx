import {Box, Checkbox, LayoutProps, ListItem, SpaceProps, Stack, Text, UnorderedList} from "@chakra-ui/react";
import {FormValue} from "../../../models/form/FormValue";
import {PERMISSIONS, SHORT_DESCRIPTION} from "../../../models/security/Permission";
import {InfoIcon} from "@chakra-ui/icons";
import {FormControls, useFormControl} from "../../../hooks/form-control";

interface CheckboxOption<T> {
	name: string,
	value: T,
	id?: string
}

interface CheckboxInputProps extends SpaceProps, LayoutProps {
	label: string,
	values: CheckboxOption<PERMISSIONS>[],
	validator?: (input:PERMISSIONS[] | undefined) => boolean,
	valueConsumer?: (value: FormValue<PERMISSIONS[]>) => void,
	controls?: FormControls<PERMISSIONS[]>
}

export function PermissionsCheckBox({label, values, validator, valueConsumer, controls, ...style}: CheckboxInputProps) {
	const { value, setValue } = useFormControl<PERMISSIONS[]>({defaultValue:Array(values.length).fill(false), validator, valueConsumer})
	const checkedItems = controls?.value ?? value
	const setCheckedItems = controls?.setValue ?? setValue

	const atLeastOneChecked = !!checkedItems.value && checkedItems.value.some(Boolean)

	return (
		<>
			<Box {...style}>
				<Text>{label}</Text>
				<Stack mt={1} spacing={1}>
					{values.slice(1).map((value) => {
						return <Checkbox
							onChange={ (e) => {
									const c = [...(checkedItems.value ?? [])]
									if (e.target.checked && !c.includes(value.value)) {
										setCheckedItems(c.concat(value.value))
									}
									else if (!e.target.checked)
										setCheckedItems(c.filter((it) => it !== value.value))
								}
							}
						>
							{value.name}
						</Checkbox>
					})}
				</Stack>
				<Box marginTop={10}>
					{ atLeastOneChecked &&
							<Text marginTop={5}>
									<InfoIcon marginRight={2}/>
									Users with this role will be able to:
								<UnorderedList>
									{(checkedItems.value ?? []).map((e) => {
										if (checkedItems.value !== undefined) {
											const x = checkedItems.value.find((it) => it === e)
											if (x === undefined) {
												return ""
											}
											const descr = Object.values(SHORT_DESCRIPTION)[Object.keys(SHORT_DESCRIPTION).indexOf(x)]
											return <ListItem>{descr}</ListItem>
										}
										return ""
									})}
                </UnorderedList>
							</Text>
					}
				</Box>
			</Box>

		</>
	)
}