import {DownloadIcon, DragHandleIcon, TimeIcon} from "@chakra-ui/icons";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    SimpleGrid,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {parse} from "csv";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {BsPersonCheck, BsPersonDash} from "react-icons/bs";
import {userPermissions} from "@/config/permission";
import {addNewRecipients, changeGeneralSetting} from "@/stores/batch-recurring/multipleRecurringPaymentSlice";
import {useAppDispatch} from "@/stores/hooks";
import TokenSelector from "@/components/shared/TokenSelector";

type AcceptedFile = File;
type RecipientData = {
    recipient: string;
    numberOfUnlocks: number;
    unlockAmountPerTime: number;
    unlockEvery: number;
    unlockEveryType: number;
    prepaidPercentage: number;
};

const RecurringPaymentForm = () => {
    const dispatch = useAppDispatch();

    const onDrop = useCallback((acceptedFiles: AcceptedFile[]) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
            // @ts-ignore
            parse(reader.result, (err: Error | null, data: any[]) => {
                if (err) {
                    console.error("Error parsing CSV:", err);
                    return;
                }
                data.shift();
                const recipients: RecipientData[] = data.map((item: any) => {
                    return {
                        recipient: item[0],
                        numberOfUnlocks: parseInt(item[1]),
                        unlockAmountPerTime: parseFloat(item[2]),
                        unlockEvery: parseInt(item[3]),
                        unlockEveryType: parseInt(item[4]),
                        prepaidPercentage: parseInt(item[5]),
                    };
                });
                dispatch(addNewRecipients(recipients));
            });
        };

        acceptedFiles.forEach((file: AcceptedFile) => reader.readAsBinaryString(file));
    }, [dispatch]);

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    const handleChangeSetting = useCallback((att: "tokenAddress" | "isNativeToken" | "startDate" | "whoCanCancel" | "whoCanTransfer", value: any) => {
        dispatch(changeGeneralSetting({att, value}));
    }, [dispatch]);

    return (
        <SimpleGrid columns={{base: 1, lg: 2}} spacing={5}>
            <Card>
                <CardHeader fontWeight={700}>General settings</CardHeader>
                <CardBody>
                    <VStack>
                        <FormControl>
                            <FormLabel>Select Token</FormLabel>
                            <TokenSelector handleOnChange={handleChangeSetting}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Start Date</FormLabel>
                            <InputGroup size={'md'}>
                                <InputLeftAddon pointerEvents="none">
                                    <TimeIcon color={useColorModeValue('gray', 'gray')}/>
                                </InputLeftAddon>
                                <Input
                                    type="datetime-local"
                                    placeholder="Name"
                                    onChange={(e) =>
                                        handleChangeSetting(
                                            "startDate",
                                            new Date(e.target.value).getTime(),
                                        )
                                    }
                                />
                            </InputGroup>
                        </FormControl>
                        <HStack gap={4} width="full">
                            <FormControl>
                                <FormLabel>Who can cancel</FormLabel>
                                <InputGroup size={'md'}>
                                    <InputLeftAddon>
                                        <BsPersonDash color={useColorModeValue('gray', 'gray')}/>
                                    </InputLeftAddon>
                                    <Select
                                        onChange={(e) =>
                                            handleChangeSetting("whoCanCancel", e.target.value)
                                        }
                                    >
                                        {userPermissions.map((p, index) => (
                                            <option key={`cancel-${index}`} value={p.value}>
                                                {p.label}
                                            </option>
                                        ))}
                                    </Select>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Who can transfer</FormLabel>
                                <InputGroup size={'md'}>
                                    <InputLeftAddon>
                                        <BsPersonCheck color={useColorModeValue('gray', 'gray')}/>
                                    </InputLeftAddon>
                                    <Select
                                        onChange={(e) =>
                                            handleChangeSetting("whoCanTransfer", e.target.value)
                                        }
                                    >
                                        {userPermissions.map((p, index) => (
                                            <option key={`transfer-${index}`} value={p.value}>
                                                {p.label}
                                            </option>
                                        ))}
                                    </Select>
                                </InputGroup>
                            </FormControl>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>
            <Card>
                <CardHeader fontWeight={700}>Upload Recipients</CardHeader>
                <CardBody>
                    <VStack>
                        <Box
                            w={"full"}
                            py="100px"
                            borderRadius={'md'}
                            textAlign={"center"}
                            cursor={'pointer'}
                            bg={useColorModeValue("purple.50", "purple.50")}
                            border={useColorModeValue("2px dotted blue", "1px dotted white")}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Flex justifyContent={'center'} alignItems={'center'} gap={1}>
                                <DragHandleIcon/>
                                <div>Drag .csv file here or click to upload</div>
                            </Flex>
                        </Box>
                    </VStack>
                </CardBody>
                <CardFooter>
                    <Button
                        size={'sm'}
                        colorScheme={"purple"}
                        onClick={() => window.open("/recipients_example_file.csv")}
                        leftIcon={<DownloadIcon/>}
                        variant={"ghost"}
                    >
                        Download Example CSV File
                    </Button>
                </CardFooter>
            </Card>
        </SimpleGrid>
    );
};
export default RecurringPaymentForm
