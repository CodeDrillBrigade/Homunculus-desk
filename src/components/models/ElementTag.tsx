import {useGetTagQuery} from "../../services/tag";
import {Container, Skeleton, SpaceProps, Tag, TagLabel, Tooltip} from "@chakra-ui/react";
import {Tag as TagModel} from "../../models/embed/Tag";
import React from "react";

interface TagLabelProps extends SpaceProps{
	tagId: string,
	compact?: boolean
}

const tag = (data: TagModel, compact: boolean | undefined, style: any) => <Tag
	size="md"
	borderRadius="full"
	variant="solid"
	bg={data.color}
	{...style}
>
	{(compact !== true) && <TagLabel>{data.name}</TagLabel>}
</Tag>

export const ElementTag = ({ tagId, compact, ...style }: TagLabelProps) => {
	const { data, error, isLoading } = useGetTagQuery(tagId)
	return (
		<>
			{!!error && <></>}
			{isLoading && <Container minWidth="2em" ><Skeleton height="1.5em" width="3em" borderRadius="full" /></Container>}
			{!!data && compact !== true && tag(data, compact, style) }
			{!!data && compact === true  && <Tooltip label={data.name}>{tag(data, compact, style)}</Tooltip>}
		</>
	)
}