import {TimeIcon} from "@chakra-ui/icons";
import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    Radio,
    RadioGroup,
    Stack,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {changeGeneralSetting} from "@/stores/batch-payment/batchPaymentSlice";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import TokenSelector from "@/components/shared/TokenSelector";

const OneTimePaymentForm = () => {
    const dispatch = useAppDispatch();
    const {generalSetting} = useAppSelector((state) => state.batchPayment);

    const handleOnChange = useCallback(
        (att: string, value: string | number | boolean) => {
            dispatch(changeGeneralSetting({att, value}));
        },
        [],
    );

    return (
        <Card>
            <CardHeader fontWeight={700}>Payment Settings</CardHeader>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Select Token</FormLabel>
                        <TokenSelector handleOnChange={handleOnChange}/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Pay</FormLabel>
                        <RadioGroup
                            onChange={(value) => handleOnChange("isPayNow", value == "true" ? true : false)}
                            value={generalSetting.isPayNow.toString()}
                        >
                            <Stack direction="row">
                                <Radio value="true">Now</Radio>
                                <Radio value="false">On specific date</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel></FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <TimeIcon color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Input
                                disabled={generalSetting.isPayNow}
                                type="datetime-local"
                                placeholder="Name"
                                onChange={(e) =>
                                    handleOnChange(
                                        "startDate",
                                        new Date(e.target.value).getTime(),
                                    )
                                }
                            />
                        </InputGroup>
                    </FormControl>
                </VStack>
            </CardBody>
        </Card>
    );
}

export default OneTimePaymentForm