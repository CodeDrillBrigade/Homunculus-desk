import { Box, Divider, Flex, Kbd, Text } from '@chakra-ui/react'
import { ElementTag } from './ElementTag'
import React from 'react'
import { Material } from '../../models/Material'

interface MaterialSummaryProps {
	material: Material
	onClick?: () => void
	showTabKbd: boolean
	showDivider: boolean
}

export const MaterialSummary = ({ material, onClick, showTabKbd, showDivider }: MaterialSummaryProps) => {
	return (
		<Box width="full">
			<Flex justifyContent="flex-start" marginLeft="1em" width="full">
				<Flex
					_hover={!!onClick ? { cursor: 'pointer' } : undefined}
					onClick={onClick}
					direction="column"
					width="100%"
				>
					<Flex>
						{showTabKbd && <Kbd marginRight="1em">Tab</Kbd>}
						<Text>
							<b>{material.name}</b>, Brand: {material.brand}
							{!!material.referenceCode && ` - # ${material.referenceCode}`}
						</Text>
					</Flex>
					{!!material.tags && material.tags.length > 0 && (
						<Flex align="center" justify="start" mt="0.2em" ml={showTabKbd ? '3em' : '0px'}>
							{material.tags.map(id => (
								<ElementTag
									key={id}
									tagId={id}
									marginRight="0.4em"
									compact={!!material.tags && material.tags.length >= 5}
								/>
							))}
						</Flex>
					)}
				</Flex>
			</Flex>
			{showDivider && <Divider mt="0.5em" ml="1em" width="98%" />}
		</Box>
	)
}
