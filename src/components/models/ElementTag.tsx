import {useGetTagQuery} from "../../services/tag";
import {Container, Skeleton, SpaceProps, Tag, TagLabel} from "@chakra-ui/react";
import React from "react";

interface TagLabelProps extends SpaceProps{
	tagId: string,
	compact?: boolean
}

export const ElementTag = ({ tagId, compact, ...style }: TagLabelProps) => {
	const { data, error, isLoading } = useGetTagQuery(tagId)
	return (
		<>
			{!!error && <></>}
			{isLoading && <Container minWidth="2em" ><Skeleton height="1.5em" width="3em" borderRadius="full" /></Container>}
			{!!data &&
				<Tag
					size="md"
					borderRadius="full"
					variant="solid"
					bg={data.color}
					{...style}
				>
					{(compact !== true) && <TagLabel>{data.name}</TagLabel>}
				</Tag>
			}
		</>
	)
}