'use client'

import {
    Box,
    Button,
    chakra,
    Container,
    Flex,
    Image,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
} from '@chakra-ui/react'
import {FaTwitter, FaVimeo} from 'react-icons/fa'
import {ReactNode} from 'react'
import {VIDEO_DEMO_URL} from "@/config/constants";

const SocialButton = ({
                          children,
                          label,
                          href,
                      }: {
    children: ReactNode
    label: string
    href: string
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            target={href !== '#' ? '_blank' : '_self'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    )
}

const Footer = () => (
    <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction={{base: 'column', md: 'row'}}
            spacing={4}
            justify={{base: 'center', md: 'space-between'}}
            align={{base: 'center', md: 'center'}}>
            <Button variant={'unstyled'} colorScheme={'purple'}>
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
            <Stack direction={'row'} spacing={6}>
                <SocialButton label={'Twitter'} href={'#'}>
                    <FaTwitter/>
                </SocialButton>
                <SocialButton href={VIDEO_DEMO_URL} label={'Vimeo'}>
                    <FaVimeo/>
                </SocialButton>
            </Stack>
        </Container>
    </Box>
);
export default Footer