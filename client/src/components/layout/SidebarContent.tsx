'use client'
import {ChevronRightIcon} from "@chakra-ui/icons";
import {
    Box,
    BoxProps, Button,
    CloseButton,
    Flex,
    Image,
    List,
    ListIcon,
    ListItem,
    Text,
    useColorModeValue,
    useStyleConfig,
    VStack,
} from "@chakra-ui/react";
import {usePathname, useRouter} from "next/navigation";
import {IconType} from "react-icons";
import {FaRegAddressBook} from "react-icons/fa";
import {FiHome} from "react-icons/fi";
import {MdAccountBalance, MdPayment} from "react-icons/md";
import {RiBillLine} from "react-icons/ri";
import {useAppSelector} from "@/stores/hooks";

interface LinkItemProps {
    name: string;
    icon?: IconType;
    url?: string;
    children?: LinkItemProps[];
}

const LinkItems: Array<LinkItemProps> = [
    {
        name: "My Balance",
        icon: MdAccountBalance,
        url: "/account/balance",
    },
    {
        name: "Address Book",
        icon: FaRegAddressBook,
        url: "/address-book",
    },
    {
        name: "Payment",
        icon: MdPayment,
        url: "/payment",
        children: [
            {
                name: "Sent Payments",
                url: "/payment/sent",
            },
            {
                name: "Received Payments",
                url: "/payment/received",
            },
            {
                name: "One-Time Payment",
                url: "/payment/one-time",
            },
            {
                name: "Recurring Payment",
                url: "/payment/recurring",
            },
        ],
    },
    {
        name: "Invoices",
        icon: RiBillLine,
        url: "/invoices/",
        children: [
            {
                name: "Sent Invoices",
                url: "/invoices/sent",
            },
            {
                name: "Received Invoices",
                url: "/invoices/received",
            },
            {
                name: "Create Invoice",
                url: "/invoices/new",
            },
        ],
    },
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
    const router = useRouter();
    const sidebarContainer = useStyleConfig("SidebarContainer");
    const navItemFlex = useStyleConfig("NavItemFlex");
    const navSubItemFlex = useStyleConfig("NavSubItemFlex");
    const navItemIcon = useStyleConfig("NavItemIcon");
    const pathname = usePathname()

    return (
        <Box sx={sidebarContainer} {...rest}>
            <Flex h="20" alignItems="center" mx="6" justifyContent="space-between">
               <Button variant={'unstyled'} onClick={() => router.push("/")} colorScheme={'purple'}>
                   <Flex gap={3} alignItems="center" justifyContent="start" width={'100%'}>
                       <Image
                           alt={"image"}
                           src={`/favicon.webp`}
                           width={{base: 30, lg: 35}}
                       />
                       <Text fontSize={20} color={useColorModeValue("gray.0", "gray.400")} fontWeight={700}>
                           CryptoFlow
                       </Text>
                   </Flex>
               </Button>
                <CloseButton display={{base: "flex", md: "none"}} onClick={onClose}/>
            </Flex>
            <VStack alignItems={"flex-start"} p={4}>
                <List>
                    {LinkItems.map((link, parentIndex) => {
                        if (link.children && link.children.length) {
                            return (
                                <ListItem
                                    style={{color: pathname.includes(link.name.toLowerCase()) ? '#B794F4' : undefined}}
                                    key={`parent-menu-${parentIndex}`} sx={navItemFlex}>
                                    <ListIcon as={link.icon} sx={navItemIcon}/>
                                    {link.name}
                                    <List>
                                        {link.children.map((subLink, childIndex) => {
                                            return (
                                                <ListItem
                                                    sx={navSubItemFlex}
                                                    key={`child-menu-${parentIndex}-${childIndex}`}
                                                    cursor="pointer"
                                                    pt={childIndex == 0 ? 5 : 4}
                                                    style={{color: pathname === subLink.url ? '#B794F4' : undefined}}
                                                    onClick={() => router.push(subLink.url || '')}
                                                >
                                                    <ListIcon as={ChevronRightIcon} mr={5}/>
                                                    {subLink.name}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </ListItem>
                            );
                        }
                        return (
                            <ListItem
                                style={{color: pathname === link.url ? '#B794F4' : undefined}}
                                key={`parent-menu-${parentIndex}`}
                                cursor="pointer"
                                sx={navItemFlex}
                                onClick={() => router.push(link.url || '')}
                            >
                                <ListIcon as={link.icon} sx={navItemIcon}/>
                                {link.name}
                            </ListItem>
                        );
                    })}
                </List>
            </VStack>
        </Box>
    );
};
