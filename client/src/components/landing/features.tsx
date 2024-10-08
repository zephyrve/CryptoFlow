'use client'

import {Box, Container, Heading, HStack, Icon, SimpleGrid, Stack, Text, VStack,} from '@chakra-ui/react'
import {CheckIcon} from '@chakra-ui/icons'

const features = [
    {
        id: 0,
        title: 'Deposits',
        text: 'Users can deposit tokens by selecting the amount and token address.',
    },
    {
        id: 1,
        title: 'Recurring Payments',
        text: 'Set up automated payments with parameters such as start date, amount, frequency, and recipients, including a prepaid percentage.',
    },
    {
        id: 2,
        title: 'One-Time Payments',
        text: 'Create immediate or scheduled payments, specifying the amount and recipient.',
    },
    {
        id: 3,
        title: 'Withdrawals',
        text: 'Recipients can withdraw amounts from payment requests based on unlocked funds, easily selecting the desired amount.',
    },
    {
        id: 4,
        title: 'Payment Requests',
        text: 'View sent and received payment requests, checking status and available amounts for tracking activities.',
    },
    {
        id: 5,
        title: 'Cancel Payments',
        text: 'UCancel active payment requests as permitted, allowing recovery of available funds.',
    },
    {
        id: 6,
        title: 'Transfer Payments',
        text: 'Transfer payment requests to different recipients for flexible transaction management.',
    },
    {
        id: 7,
        title: 'Token Balances',
        text: 'Check token balances, including available and locked amounts, for a clear financial overview.',
    },
    {
        id: 8,
        title: 'Transaction History',
        text: 'View transaction history to track financial activities and monitor the flow of funds.'
    }
];


const Features = () => (
    <Box p={4} mt={5} mb={20}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'4xl'} color={'purple.500'}>Features</Heading>
            <Text color={'gray.600'} fontSize={'xl'}>
                Simplify Your Payments and Maximize Control Over Your Funds
            </Text>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
            <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10}>
                {features.map((feature) => (
                    <HStack key={feature.id} align={'top'}>
                        <Box color={'purple.400'} px={2}>
                            <Icon as={CheckIcon}/>
                        </Box>
                        <VStack align={'start'}>
                            <Text fontWeight={600}>{feature.title}</Text>
                            <Text color={'gray.600'}>{feature.text}</Text>
                        </VStack>
                    </HStack>
                ))}
            </SimpleGrid>
        </Container>
    </Box>
);
export default Features