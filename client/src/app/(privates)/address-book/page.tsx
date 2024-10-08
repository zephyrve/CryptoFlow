'use client'
import {SimpleGrid, VStack} from "@chakra-ui/react";
import AddressForm from "@/components/address-book/AddressForm";
import AddressList from "@/components/address-book/AddressList";
import GroupForm from "@/components/address-book/GroupForm";

const Page = () => (
    <VStack>
        <SimpleGrid
            columnGap={10}
            rowGap={2}
            columns={{base: 1, lg: 2}}
            width={'100%'}
        >
            <AddressForm/>
            <GroupForm/>
        </SimpleGrid>
        <AddressList/>
    </VStack>
);
export default Page
