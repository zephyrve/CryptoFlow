import {Button, Flex, FlexProps, HStack, IconButton, Image, useColorModeValue,} from "@chakra-ui/react";
import {FiMenu} from "react-icons/fi";
import {MdAccountBalanceWallet} from "react-icons/md";
import {useAddress} from "@/hooks/useAddress";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

export const MobileNav = ({onOpen, ...rest}: MobileProps) => {
    const {getShortAddress} = useAddress();
    const {account, status, connect, switchChain} = useMetaMask()

    return (
        <Flex
            ml={{base: 0, md: "270px"}}
            px={{base: 4, md: 4}}
            height="20"
            alignItems="center"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{
                base: "space-between",
                md: "flex-end",
                lg: "space-between",
            }}
            {...rest}
        >
            <Flex justifyContent={'center'} alignItems={'center'}>
                <IconButton
                    display={{base: "flex", md: "none"}}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu/>}
                />
                <Image
                    alt={"image"}
                    ml={1}
                    display={{base: "flex", md: "none"}}
                    src={"/favicon.webp"}
                    width={39}
                />
            </Flex>

            {status === 'connected' &&
                <HStack spacing={{base: "0", md: "6"}}>
                    <Button
                        variant={"ghost"}
                        display={{base: "inline-flex", md: "inline-flex"}}
                        colorScheme="blue"
                        gap={2}
                        leftIcon={<MdAccountBalanceWallet fontSize={"sm"}/>}
                    >
                        {status === 'connected' ? `${getShortAddress(account, 10)}` : "Connect Wallet"}
                    </Button>
                </HStack>
            }
        </Flex>
    );
};
