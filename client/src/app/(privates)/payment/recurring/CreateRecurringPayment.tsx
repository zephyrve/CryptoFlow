"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import {z} from "zod"
import {parse} from "csv";

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import React, {useCallback, useMemo} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {CalendarIcon, TrashIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/utils/styles";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimePicker} from "@/components/share/time-picker/TimePicker";
import {createRecurringPayments} from "@/app/(privates)/payment/api-payment";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {useDropzone} from "react-dropzone";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {userPermissions} from "@/config/permission";
import {AutoComplete as AutoCompletes} from "@/components/share/AutoCompletes";
import TokenBalanceSelect from "@/components/share/TokenBalanceSelect";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import {Label} from "@/components/ui/label";
import {DEFAULT_CHAIN_ID, tokenAddressInfo} from "@/utils/chainSettings";
import {useWalletStore} from "@/stores/useWalletStore";
import {isAddress} from "viem";
import {Badge} from "@/components/ui/badge";

export const FormSchemaRecurring = z.object({
    isPayNow: z.string(),
    tokenAddress: z.string(),
    whoCanCancel: z.string().min(1),
    whoCanTransfer: z.string().min(1),
    startDate: z.date(),
    recipients: z.array(
        z.object({
            recipient: z.string().refine((value) => value.length > 0, {
                message: "Address required",
            }),
            numberOfUnlocks: z.string()
                .refine((value) => Number(value) > 0, {
                    message: "Unlocks ≥ 1",
                }),
            unlockAmountPerTime: z.string()
                .refine((value) => Number(value) > 0, {
                    message: "Amount ≥ 0",
                }),
            unlockEvery: z.string()
                .refine((value) => Number(value) > 0, {
                    message: "Interval must be > 0",
                }),
            unlockEveryType: z.string(),
            prepaidPercentage: z.string()
                .refine((value) => Number(value) >= 0, {
                    message: "Prepaid ≥ 0%",
                }).refine((value) => Number(value) <= 100, {
                    message: "Prepaid ≤ 100%",
                })
        })
    ),
})

const timeOptions = [
    {value: "1", label: "Second"},
    {value: "60", label: "Minute"},
    {value: "3600", label: "Hour"},
    {value: "86400", label: "Day"},
    {value: "604800", label: "Week"},
    {value: "2592000", label: "Month"},
    {value: "31536000", label: "Year"}
];

const initialFormData = {
    isPayNow: "true",
    tokenAddress: CONTRACT_ADDRESS,
    startDate: new Date(),
    whoCanCancel: "0",
    whoCanTransfer: "0",
    recipients: [{
        numberOfUnlocks: '1',
        prepaidPercentage: "0",
        recipient: "",
        unlockAmountPerTime: '1',
        unlockEvery: '1',
        unlockEveryType: "1"
    }],
}

export function CreateRecurringPayment() {
    const {address, chain, chainId} = useAccount()
    const {setIsLoadingCreatePayment, isLoadingCreatePayment} = usePaymentRequestsStore()
    const {addresses} = useAddressesStore()
    const {getBalances} = useWalletStore()

    const form = useForm<z.infer<typeof FormSchemaRecurring>>({
        resolver: zodResolver(FormSchemaRecurring),
        defaultValues: initialFormData
    })

    const {fields, append, remove} = useFieldArray({
        name: "recipients",
        control: form.control
    });

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
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
                    const recipients: {
                        recipient: string;
                        numberOfUnlocks: string;
                        unlockAmountPerTime: string;
                        unlockEvery: string;
                        unlockEveryType: string;
                        prepaidPercentage: string;
                    }[] = data.map((item: any) => {
                        return {
                            recipient: item[0],
                            numberOfUnlocks: item[1],
                            unlockAmountPerTime: item[2],
                            unlockEvery: item[3],
                            unlockEveryType: item[4],
                            prepaidPercentage: item[5],
                        };
                    });
                    form.setValue('recipients', [...form.getValues('recipients'), ...recipients])
                });
            };
            acceptedFiles.forEach((file: File) => reader.readAsBinaryString(file));
        }
    });

    const resetFile = useCallback(() => {
        form.resetField('isPayNow')
        form.resetField('tokenAddress')
        form.resetField('startDate')
        form.resetField('recipients')
    }, [])

    const onSubmit = async (data: z.infer<typeof FormSchemaRecurring>) => {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingCreatePayment(true)
            if (chainId) {
                const transaction = await createRecurringPayments({
                    address: address!,
                    recurringPaymentsData: {
                        recipients: data.recipients.map(r => ({
                            recipient: r.recipient,
                            numberOfUnlocks: parseInt(r.numberOfUnlocks),
                            unlockAmountPerTime: parseFloat(r.unlockAmountPerTime),
                            unlockEvery: parseInt(r.unlockEvery),
                            unlockEveryType: parseInt(r.unlockEveryType),
                            prepaidPercentage: parseFloat(r.prepaidPercentage),
                        })),
                        generalSetting: {
                            isNativeToken: tokenAddressInfo[chainId][data.tokenAddress].isNative,
                            startDate: new Date(data.startDate).getTime(),
                            tokenAddress: data.tokenAddress,
                            whoCanCancel: parseInt(data.whoCanCancel),
                            whoCanTransfer: parseInt(data.whoCanTransfer)
                        }
                    }
                })

                resetFile()

                toast.success(
                    <div className={'flex flex-col justify-start gap-2'}>
                        <div className={'font-bold'}>Payment completed successfully!</div>
                        <Link target={'_blank'}
                              href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                            {shortAddress(transaction?.transactionHash)}
                        </Link>
                    </div>
                )

                await getBalances({address: address!})
            }
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) {
                if (e?.shortMessage.includes('startDate<block.timestamp')) toast.error('Start date cannot be in the past. Please choose a valid future date!')
                else (toast.error(e?.shortMessage))
            } else toast.error(e?.message);
        } finally {
            setIsLoadingCreatePayment(false)
        }
    };

    const onOpenDeleteAddressModal = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()
        window.open("/recipients_example_file.csv")
    }, []);

    const addressesOptions = useMemo(() => addresses.map(addr => ({
        value: addr.walletAddress,
        label: addr.name
    })), [addresses])


    return (
        <Form {...form} >
            <form autoComplete="new-password" onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 w-full">
                <Card className={'w-full overflow-hidden border-none'}>
                    <CardHeader
                        className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                    >
                        Create Recurring Payment
                    </CardHeader>
                    <CardContent>
                        <div className={'lg:grid-cols-[3fr_1fr] grid-cols-1 grid  gap-5'}>
                            <div className={'flex flex-col gap-4 w-full'}>
                                <FormField
                                    control={form.control}
                                    name="tokenAddress"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Token</FormLabel>
                                            <FormControl>
                                                <TokenBalanceSelect field={field as any}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <Popover>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "dark:bg-muted w-full justify-start text-left font-normal bg-muted/70 hover:bg-muted/80",
                                                                {"text-muted-foreground": !field.value}
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value
                                                                ? format(field.value, "PPP HH:mm")
                                                                : <span>Pick a date</span>
                                                            }
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>
                                                <PopoverContent align={'start'} className="w-auto p-0">
                                                    <Calendar
                                                        disabled={(date) => date.getTime() < new Date().setDate(new Date().getDate() - 1)}
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t border-border">
                                                        <TimePicker
                                                            setDate={field.onChange}
                                                            date={field.value}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <div className={'w-full flex gap-2 items-start align-top justify-between  '}>
                                    <FormField
                                        control={form.control}
                                        name={`whoCanCancel`}
                                        render={({field}) => (
                                            <FormItem className={'w-full'}>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormLabel>Who Can Cancel</FormLabel>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder="Permision"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {userPermissions.map((p, index) => (
                                                            <SelectItem
                                                                key={`cancel-${index}`}
                                                                value={p.value}
                                                            >
                                                                {p.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`whoCanTransfer`}
                                        render={({field}) => (
                                            <FormItem className={'w-full'}>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormLabel>Who Can Transfer</FormLabel>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder="Permision"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {userPermissions.map((p, index) => (
                                                            <SelectItem
                                                                key={`cancel-${index}`}
                                                                value={p.value}
                                                            >
                                                                {p.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className={'flex flex-col w-full gap-2'}>
                                <Label>
                                    File
                                </Label>
                                <div
                                    className="mt-2 rounded-md shadow-sm p-5 bg-muted/40 hover:bg-primary/10 hover:border-primary active:bg-primary/80 transition-all duration-300 cursor-pointer w-full h-full border-dashed border-2 border-primary/50 flex justify-center items-center"
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <div className={'text-center'}>
                                        Drag and drop a <strong>.csv</strong> file here, or click to upload.
                                    </div>
                                </div>
                                <div className={'flex justify-end'}>
                                    <Button
                                        onClick={onOpenDeleteAddressModal}
                                        size={'sm'}
                                        className={'p-1 px-2 w-full h-min'}
                                    >
                                        Download Example CSV File
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Card className={'my-4'}>
                            <div className="flex">
                                <ScrollArea type="always" className="w-1 flex-1">
                                    {fields.length > 0 &&
                                        <div className="flex gap-2 pb-1 w-full">
                                            <div className="w-full overflow-x-auto">
                                                {fields.map((token, index) => (
                                                    <div key={token.id}
                                                         className={`gap-1 w-full md:min-w-[850px] grid grid-cold-1 md:grid-cols-[6fr_2fr_2fr_2fr_3fr_2fr_60px] md:gap-4 px-4 pb-3 pt-1 items-start ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                                                        <FormField
                                                            name={`recipients.${index}.recipient`}
                                                            control={form.control}
                                                            render={({field}) => {
                                                                let userName = ''
                                                                if (field.value?.length === 42 && isAddress(field.value)) {
                                                                    userName = addressesOptions.find(addr => addr.value === field.value)?.label ?? ''
                                                                }
                                                                return (
                                                                    <FormItem>
                                                                        <FormLabel>Recipient</FormLabel>
                                                                        <FormControl>
                                                                            <div className="space-y-2">
                                                                                <AutoCompletes
                                                                                    inputValue={field.value}
                                                                                    setInputValue={field.onChange}
                                                                                    data={addressesOptions}
                                                                                    {...field}
                                                                                />
                                                                                {userName !== '' && (
                                                                                    <Badge
                                                                                        className="truncate">{userName}</Badge>
                                                                                )}
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`recipients.${index}.numberOfUnlocks`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className={'text-nowrap'}>
                                                                        Nr of Unlocks</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="number"/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`recipients.${index}.unlockAmountPerTime`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className={'text-nowrap'}>Unlock
                                                                        Amount</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="number"
                                                                               step="0.01"/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`recipients.${index}.unlockEvery`}
                                                            render={({field}) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel className={'text-nowrap'}>Unlock
                                                                        Every</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="number"/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`recipients.${index}.unlockEveryType`}
                                                            render={({field}) => (
                                                                <FormItem className="flex-1">
                                                                    <FormLabel>Unit</FormLabel>
                                                                    <Select onValueChange={field.onChange}
                                                                            defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Token"/>
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {timeOptions.map((option) => (
                                                                                <SelectItem key={option.value}
                                                                                            value={option.value}>
                                                                                    {option.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`recipients.${index}.prepaidPercentage`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Prepaid</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="number" step="1"
                                                                               min="0" max="100"/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="outline"
                                                            disabled={form.getValues('recipients').length <= 1}
                                                            onClick={() => remove(index)}
                                                            className={'mt-2 md:mt-[32px]'}
                                                        >
                                                            <TrashIcon size={18} className={'stroke-red-500'}/>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    <ScrollBar orientation="horizontal"/>
                                </ScrollArea>
                            </div>
                        </Card>

                        <div className={'flex justify-between w-full'}>
                            <Button
                                type="button"
                                variant={'outline'}
                                onClick={() => append({
                                    numberOfUnlocks: '1',
                                    prepaidPercentage: "0",
                                    recipient: "",
                                    unlockAmountPerTime: "1",
                                    unlockEvery: '1',
                                    unlockEveryType: "1"
                                })}
                            >
                                Add Recipient
                            </Button>

                            <Button
                                disabled={isLoadingCreatePayment}
                                isLoading={isLoadingCreatePayment}
                                type="submit"
                            >
                                Submit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
