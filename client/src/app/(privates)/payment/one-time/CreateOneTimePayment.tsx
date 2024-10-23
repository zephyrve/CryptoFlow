"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {CalendarIcon, TrashIcon} from "lucide-react";
import {useWalletStore} from "@/stores/useWalletStore";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/utils/styles";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimePicker} from "@/components/share/time-picker/TimePicker";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {createOneTimePayments} from "@/app/(privates)/payment/api-payment";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {AutoComplete as AutoCompletes} from "@/components/share/AutoCompletes";
import {useAddressesStore} from "@/stores/useAddressesStore";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import React, {useCallback, useMemo} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {addUserTransaction} from "@/app/(privates)/statistics/api-settings";
import {DEFAULT_CHAIN_ID, tokenAddressInfo, whiteListTokenOfChain} from "@/utils/chainSettings";
import {isAddress} from "viem";
import {Badge} from "@/components/ui/badge";

const FormSchema = z.object({
    isPayNow: z.string(),
    tokenAddress: z.string(),
    startDate: z.date(),
    recipients: z.array(z.object({
        recipient: z.string().min(1),
        amount: z.string()
            .refine((value) => Number(value) > 0, {
                message: "Amount must be greater than 0",
            }),
    }))
})

const initialFormData = {
    isPayNow: "true",
    tokenAddress: CONTRACT_ADDRESS,
    startDate: new Date(),
    recipients: [{recipient: '', amount: undefined}]
}

export function CreateOneTimePayment() {
    const {address, chain, chainId} = useAccount()
    const {balances, getBalances} = useWalletStore()
    const {setIsLoadingCreatePayment, isLoadingCreatePayment} = usePaymentRequestsStore()
    const {addresses} = useAddressesStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    const {fields, append, remove} = useFieldArray({
        name: "recipients",
        control: form.control
    });

    const resetForm = useCallback(() => {
        form.resetField('isPayNow')
        form.resetField('tokenAddress')
        form.resetField('startDate')
        form.resetField('recipients')
    }, [])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingCreatePayment(true)
            if (chainId) {
                let isSuccess = false;
                let transaction = null;

                if (address) {
                    transaction = await createOneTimePayments({
                        address: address!,
                        recipients: data.recipients,
                        formData: {
                            isPayNow: data.isPayNow === "true",
                            startDate: new Date(data.startDate).getTime(),
                            tokenAddress: data.tokenAddress,
                            isNativeToken: tokenAddressInfo[chainId][data.tokenAddress].isNative,
                        }
                    })
                    if (transaction) {
                        isSuccess = true;
                    }
                }

                if (transaction) {
                    let totalAmount = 0
                    for (let i = 0; i < data.recipients.length; i++) {
                        totalAmount += parseFloat(data.recipients[i].amount)
                    }
                    await addUserTransaction({
                        walletAddress: address!,
                        isSuccess: isSuccess,
                        details: {
                            // @ts-ignore
                            amount: parseFloat(totalAmount),
                            type: 'one-time-payment',
                            timestamp: new Date().getTime(),
                            transactionHash: transaction?.transactionHash,
                        },
                    })
                }

                resetForm()
                await getBalances({address: address!})
                toast.success(<div className={'flex flex-col justify-start gap-2'}>
                    <div className={'font-bold'}>Payment completed successfully!</div>
                    <Link target={'_blank'} href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                        {shortAddress(transaction?.transactionHash)}
                    </Link>
                </div>)
            }
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) {
                if (e?.shortMessage.includes('startDate<block.timestamp') || e?.shortMessage.includes('startDate<timestamp'))
                    toast.error('Start date cannot be in the past. Please choose a valid future date!')
                else
                    (toast.error(e?.shortMessage))
            } else toast.error(e?.message);
        } finally {
            setIsLoadingCreatePayment(false)
        }
    }

    const addressesOptions = useMemo(() => addresses.map(addr => ({
        value: addr.walletAddress,
        label: addr.name
    })), [addresses])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full space-y-2">
                <Card className={'w-full overflow-hidden border-none'}>
                    <CardHeader
                        className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                    >
                        One Time Payment
                    </CardHeader>
                    <CardContent className={'space-y-2'}>
                        <FormField
                            control={form.control}
                            name="tokenAddress"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Token</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Token"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {chainId && whiteListTokenOfChain[chainId].map((token) => {
                                                const tokenBalance =
                                                    balances.filter(i => i.address == token.address);
                                                let availableAmount = 0;
                                                if (tokenBalance.length)
                                                    availableAmount = tokenBalance[0].balance - tokenBalance[0].lockedAmount;
                                                return (
                                                    <SelectItem
                                                        key={`option-${token.symbol}`}
                                                        value={token.address}
                                                    >
                                                        {token.name} ({availableAmount})
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPayNow"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Pay</FormLabel>
                                    <FormControl>
                                        <Card className={'w-max'}>
                                            <CardContent className={'p-2'}>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex items-center align-middle space-x-3"
                                                    {...field}
                                                >
                                                    <FormItem
                                                        className="flex items-center align-middle space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="true"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Now
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem
                                                        className="flex items-center align-middle space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="false"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            On specific date
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </CardContent>
                                        </Card>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {form.getValues('isPayNow') === 'false' &&
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({field}) => (
                                    <FormItem className="flex flex-col mt-8">
                                        <Popover>
                                            <FormControl>
                                                <PopoverTrigger
                                                    disabled={form.getValues('isPayNow') === 'true'}
                                                    asChild
                                                >
                                                    <div className={'space-y-1'}>
                                                        <Button
                                                            type={'button'}
                                                            variant={'outline'}
                                                            className={cn(
                                                                "mt-3 w-full justify-start text-left font-normal",
                                                                {"text-muted-foreground": !field.value}
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value
                                                                ? format(field.value, "PPP HH:mm")
                                                                : <span>Pick a date</span>
                                                            }
                                                        </Button>
                                                    </div>
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
                        }

                        <Card>
                                <div className="flex">
                                    <ScrollArea type="always" className="w-1 flex-1">
                                        {fields.length > 0 && (
                                            <div className="flex gap-2 pb-1">
                                                <div className="md:min-w-[400px] w-full">
                                                    {fields.map((token, index) => (
                                                        <div key={token.id} className={`gap-1 w-full grid-cols-1 grid md:grid-cols-[4fr_2fr_60px] md:gap-4 p-4 items-start ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                                                            <FormField
                                                                name={`recipients.${index}.recipient`}
                                                                control={form.control}
                                                                render={({field}) => {
                                                                    let userName = ''
                                                                    if (field.value?.length === 42 && isAddress(field.value)) {
                                                                        userName = addressesOptions.find(addr => addr.value === field.value)?.label ?? ''
                                                                    }
                                                                    return (
                                                                        <FormItem className="w-full">
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
                                                                                        <Badge className="truncate">{userName}</Badge>
                                                                                    )}
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )
                                                                }}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`recipients.${index}.amount`}
                                                                render={({field}) => (
                                                                    <FormItem className="w-full">
                                                                        <FormLabel>Amount</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} placeholder="Amount" type="number" />
                                                                        </FormControl>
                                                                        <FormMessage />
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
                                        )}
                                        <ScrollBar orientation="horizontal"/>
                                    </ScrollArea>
                                </div>
                        </Card>

                        <div className={'flex justify-between w-full'}>
                            <Button
                                type="button"
                                variant={'outline'}
                                onClick={() => append({recipient: "", amount: ""})}
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
