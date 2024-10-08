import {Box, Drawer, DrawerContent, Stack, useBreakpointValue, useDisclosure, useStyleConfig,} from "@chakra-ui/react";
import {ReactNode} from "react";

import {MobileNav} from "./MobileNav";
import {SidebarContent} from "./SidebarContent";

const SidebarWithHeader = ({children,}: { children: ReactNode; }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const sidebarWrapper = useStyleConfig("SidebarWrapper");

    return (
        <Box sx={sidebarWrapper}>
            <SidebarContent
                onClose={onClose}
                display={{base: "none", md: "block"}}
            />

            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="xs"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose}/>
                </DrawerContent>
            </Drawer>

            <MobileNav onOpen={onOpen}/>

            <Box ml={{base: 0, md: 270}} mr={{base: 0}} p={"4"}>
                <Stack
                    alignItems={"initial"}
                    direction={useBreakpointValue({
                        base: "column",
                        sm: "column",
                        md: "column",
                        lg: "column",
                        xl: "row",
                        "2xl": "row",
                    })}
                >
                    <Box width={"full"}>{children}</Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default SidebarWithHeader