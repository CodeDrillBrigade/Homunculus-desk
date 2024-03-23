import {Container, Skeleton, VStack} from "@chakra-ui/react";

interface StackedSkeletonProps {
	quantity: number;
	height: string;
	minWidth?: string;
}

export const StackedSkeleton = ({ quantity, minWidth, height }: StackedSkeletonProps) => {
	return <VStack>{generateSkeletons({ quantity, minWidth, height })}</VStack>
}

export const generateSkeletons = ({ quantity, minWidth, height }: StackedSkeletonProps) =>
	[...Array.from({length: quantity}, (_, i) => i)].map((it) => (
		<Container key={it} minWidth={minWidth ?? "100%"}>
			<Skeleton height={height} />
		</Container>
	))