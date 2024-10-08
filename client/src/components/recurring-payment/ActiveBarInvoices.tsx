import {AddIcon} from "@chakra-ui/icons";
import {Button, ButtonGroup, VStack} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

const ActionBarInvoices = () => {
    const router = useRouter();

    return (
        <VStack alignItems={"flex-end"} justifyItems="flex-end" mb={5}>
            <ButtonGroup>
                <Button
                    leftIcon={<AddIcon/>}
                    colorScheme={"purple"}
                    onClick={() => router.push("/invoices/new")}
                >
                    Create Invoice
                </Button>
            </ButtonGroup>
        </VStack>
    );
}

export default ActionBarInvoices
