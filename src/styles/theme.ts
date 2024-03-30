import { extendTheme, ThemeConfig, StyleFunctionProps } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

export const appTheme = extendTheme({
    config,
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
                color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            }
        }),
    },
});

export const borderDark = 'gray.700'
export const borderLight = 'gray.400'