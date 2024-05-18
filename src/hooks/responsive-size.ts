import { useBreakpointValue } from '@chakra-ui/react'

export function useIsMobileLayout(): boolean {
	const screenSize = useBreakpointValue({
		base: true,
		xs: true,
		sm: true,
		md: false,
		lg: false,
		xl: false,
	})
	return screenSize ?? false
}
