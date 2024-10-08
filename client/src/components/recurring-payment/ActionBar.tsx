import {AddIcon, RepeatClockIcon} from "@chakra-ui/icons";
import {Button, ButtonGroup, VStack} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

const ActionBar = () => {
    const router = useRouter();

    return (
        <VStack alignItems={"flex-end"} justifyItems="flex-end" mb={5}>
            <ButtonGroup>
                <Button
                    leftIcon={<AddIcon/>}
                    colorScheme={"purple"}
                    onClick={() => router.push("/payment/one-time")}
                >
                    Create One-Time Payment
                </Button>
                <Button
                    leftIcon={<RepeatClockIcon/>}
                    colorScheme={"blue"}
                    onClick={() => router.push("/payment/recurring")}
                >
                    Create Recurring Payment
                </Button>
            </ButtonGroup>
        </VStack>
    );
}

export default ActionBar
