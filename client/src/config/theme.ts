'use client'
import {createMultiStyleConfigHelpers, extendTheme} from "@chakra-ui/react";
import {StyleConfig} from "@chakra-ui/theme-tools";
import {cardAnatomy, inputAnatomy, numberInputAnatomy, selectAnatomy} from "@chakra-ui/anatomy";

const fonts = {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
};

const letterSpacings = {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
};

const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const {defineMultiStyleConfig: defineMultiStyleConfigCardAnatomy} = createMultiStyleConfigHelpers(cardAnatomy.keys);
const {defineMultiStyleConfig: defineMultiStyleConfigInputAnatomy} = createMultiStyleConfigHelpers(inputAnatomy.keys);
const {defineMultiStyleConfig: defineMultiStyleConfigInputAnatomyNumberInputAnatomy} = createMultiStyleConfigHelpers(numberInputAnatomy.keys);
const {defineMultiStyleConfig: defineMultiStyleConfigSelectAnatomy} = createMultiStyleConfigHelpers(selectAnatomy.keys);

const selectTheme = defineMultiStyleConfigSelectAnatomy({
    defaultProps: {
        size: "lg",
    },
});

const numberInputTheme = defineMultiStyleConfigInputAnatomyNumberInputAnatomy({
    baseStyle: {
        field: {},
        addon: {
            color: "blue",
        },
    },
    defaultProps: {
        size: "lg",
    },
});


const cardTheme = defineMultiStyleConfigCardAnatomy({
    sizes: {
        md: {
            container: {
                borderRadius: 20,
                mb: 5,
            },
        },
    },
    baseStyle: {

        header: {
            fontSize: 16,
            fontWeight: 500,
            textTransform: "uppercase",
            bg: "purple.200",
            borderRadius: "20px 20px 0 0",
            _dark: {
                bg: "gray.900",
            },
        },
        container: {
            boxShadow: 'md',
            w: "full",
            _dark: {
                bg: "gray.800",
            },
        },
    },
});

const customGeneralCardStyle = () => {
    return {
        w: "full",
        rounded: 20,
    };
};

const customBoldCardStyle = () => {
    return {
        w: "full",
        rounded: 20,
    };
};

const inputTheme = defineMultiStyleConfigInputAnatomy({
    baseStyle: {
        addon: {
            color: "blue",
            _dark: {
                color: "white",
            },
        },
    },
    defaultProps: {
        size: "lg",
    },
});

const sidebarContainerStyle = (colorMode: any) => {
    return {
        bg: colorMode == "light" ? "gray.900" : "gray.900",
        transition: "3s ease",
        borderRight: 1,
        borderRightColor: colorMode === "light" ? "gray.200" : "gray.700",
        w: {base: "full", md: "250px"},
        pos: "fixed",
        top: "10px",
        bottom: "10px",
        color: colorMode === "light" ? "white" : "white",
        mr: "20px",
        ml: "10px",
        rounded: "20px",
    };
};

const sidebarWrapperStyle = (colorMode: any) => {
    return {
        minH: "100vh",
        bg:
            colorMode === "light"
                ? "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,1) 100%);"
                : "gray.700",
    };
};
const navItemLinkStyle = () => {
    return {
        textDecoration: "none",
        _focus: {boxShadow: "none"},
        width: "full",
        _hover: {
            textDecoration: "none",
        },
    };
};

const navItemFlexStyle = (colorMode: any) => {
    return {
        transition: "0.5s ease",
        alignItems: "center",
        align: "center",
        py: 1,
        ml: 4,
        mt: 5,
        mb: 5,
        role: "group",
        w: "full",
        color: colorMode == "light" ? "gray.200" : "gray.600",
        _hover: {
            color: "purple.300",
        },
    };
};

const navSubItemFlexStyle = (colorMode: any) => {
    return {
        transition: "0.5s ease",
        alignItems: "center",
        align: "center",
        w: "full",
        color: colorMode == "light" ? "gray.200" : "gray.600",
        _hover: {
            color: "purple.300",
        },
    };
};

const navItemContentStyle = () => {
    return {
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 1,
    };
};

const navItemIconStyle = () => {
    return {
        mr: 4,
        fontSize: 22,
        opacity: 0.7,
        _groupHover: {
            color: "white",
        },
    };
};

const components: Record<string, StyleConfig> = {
    SidebarContainer: {
        baseStyle: ({colorMode}) => sidebarContainerStyle(colorMode),
    },
    SidebarWrapper: {
        baseStyle: ({colorMode}) => sidebarWrapperStyle(colorMode),
    },
    NavItemFlex: {
        baseStyle: ({colorMode}) => navItemFlexStyle(colorMode),
    },
    NavSubItemFlex: {
        baseStyle: ({colorMode}) => navSubItemFlexStyle(colorMode),
    },
    NavItemContent: {
        baseStyle: () => navItemContentStyle(),
    },
    NavItemLink: {
        baseStyle: () => navItemLinkStyle(),
    },
    NavItemIcon: {
        baseStyle: () => navItemIconStyle(),
    },
    CustomGeneralCard: {
        baseStyle: () => customGeneralCardStyle(),
    },
    CustomBoldCard: {
        baseStyle: () => customBoldCardStyle(),
    },
    CustomParentListItem: {
        baseStyle: () => ({}),
    },
    CustomChildListItem: {
        baseStyle: () => ({}),
    },
    // @ts-ignore
    Input: inputTheme,
    // @ts-ignore
    NumberInput: numberInputTheme,
    // @ts-ignore
    Select: selectTheme,
    // @ts-ignore
    Card: cardTheme,
    FormControl: {
        baseStyle: {
            mb: 3,
        },
    },
    FormLabel: {
        baseStyle: {
            mt: 3,
            fontWeight: 400,
            color: "gray.500",
        },
    },
};

export const theme = extendTheme({
    letterSpacings,
    fonts,
    config,
    components,
});
