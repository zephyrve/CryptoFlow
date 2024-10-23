"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm, useWatch} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import React, {useEffect, useMemo, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useWalletStore} from "@/stores/useWalletStore";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {AutoComplete as AutoCompletes} from "@/components/share/AutoCompletes";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {getInvoiceAmount} from "@/utils/invoices";
import {Card, CardContent} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {TrashIcon} from "lucide-react";
import {useInvoicesStore} from "@/stores/useInvoicesStore";
import {whiteListTokenOfChain} from "@/utils/chainSettings";
import {isAddress} from "viem";
import {truncateNumberByLength} from "@/utils/funstions";
import {Separator} from "@/components/ui/separator";

const FormSchema = z.object({
    recipient: z.string().min(1),
    category: z.string().min(1),
    tags: z.string().min(1),
    tokenAddress: z.string(),
    items: z.array(z.object({
        description: z.string().min(1),
        qty: z.string()
            .refine((value) => Number(value) > 0, {
                message: "Qty must be greater than 0",
            }),
        unitPrice: z.string()
            .refine((value) => Number(value) > 0, {
                message: "Unit Price must be greater than 0",
            }),
        discount: z.string()
            .refine((value) => Number(value) <= 100, {
                message: "Discount must be <= 100",
            }),
        tax: z.string()
            .refine((value) => Number(value) <= 100, {
                message: "Tax must be <= 100",
            })
    })).min(1, {message: "At least one item is required"})
})

const initialState = {
    recipient: '',
    category: '',
    tags: '',
    tokenAddress: CONTRACT_ADDRESS,
    items: [{qty: '1', tax: '0', description: '', discount: '0', unitPrice: '1'}]
}

export function InvoiceForm() {
    const {address, chainId} = useAccount()
    const {balances} = useWalletStore()
    const {setIsLoadingCreatePayment, isLoadingCreatePayment} = usePaymentRequestsStore()
    const {addresses} = useAddressesStore()
    const {createInvoice} = useInvoicesStore()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialState,
    })

    const {fields, append, remove} = useFieldArray({
        name: "items",
        control: form.control
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!isAddress(data.recipient)) {
            form.setError('recipient', {message: 'Invalid address!'})
            return
        }

        try {
            setIsLoadingCreatePayment(true)
            if (chainId) {
                await createInvoice({
                    address: address as `0x${string}`,
                    items: data.items,
                    settings: {...data, recipient: data?.recipient?.toLowerCase()}
                })
            }
            toast.success('New invoice created successfully!')
            form.reset(initialState)
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) toast.error(e?.shortMessage);
            else toast.error(e?.message);
        } finally {
            setIsLoadingCreatePayment(false)
        }
    };

    const watchedItems = useWatch({
        control: form.control,
        name: "items",
    });

    const [totals, setTotals] = useState<{
        due: number,
        totalAmount: number,
        totalTaxAmount: number,
        amountWithoutTax: number
    }>({
        due: 0, totalAmount: 0, totalTaxAmount: 0, amountWithoutTax: 0
    })

    useEffect(() => {
        const {due, totalAmount, totalTaxAmount, amountWithoutTax} = getInvoiceAmount(watchedItems as any);
        setTotals({due, totalAmount, totalTaxAmount, amountWithoutTax})
    }, [watchedItems]);

    const addressesOptions = useMemo(() => addresses.map(addr => ({
        value: addr.walletAddress,
        label: addr.name
    })), [addresses])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                <FormField
                    control={form.control}
                    name={`recipient`}
                    render={({field}) => {
                        let userName = ''
                        if (field.value.length === 42) {
                            if (isAddress(field.value)) {
                                userName = addressesOptions.find(addr => addr.value === field.value)?.label ?? ''
                            }
                        }
                        return <FormItem className={'w-full'}>
                            <FormControl>
                                <>
                                    <AutoCompletes
                                        inputValue={field.value}
                                        setInputValue={field.onChange}
                                        data={addressesOptions}
                                        {...field}
                                    />
                                    {userName !== '' &&
                                        <Badge
                                            className={'truncate '}>
                                            {userName}
                                        </Badge>
                                    }
                                </>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}
                />
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
                                        const tokenBalance = balances.filter(
                                            (i) => i.address == token.address,
                                        );
                                        let availableAmount = 0;
                                        if (tokenBalance.length) {
                                            availableAmount = tokenBalance[0].balance - tokenBalance[0].lockedAmount;
                                        }
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

                <div className={'flex justify-between w-full items-start gap-2'}>
                    <FormField
                        control={form.control}
                        name="category"
                        render={({field}) => (
                            <FormItem className={'w-full'}>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Category" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({field}) => (
                            <FormItem className={'w-full'}>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tags" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                {fields.length > 0 && (
                    <Card className="w-full">
                        <div className="flex">
                            <ScrollArea type="always" className="w-1 flex-1">
                                <div className="w-full md:min-w-[600px]">
                                    {fields.map((item, index) => (
                                        <div key={item.id} className={`grid grid-cols-1 justify-start md:grid-cols-[4fr_1fr_1fr_1fr_1fr_60px] gap-1 md:gap-4 px-4 pb-3 pt-1 items-start ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.description`}
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Description" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.qty`}
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Qty</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Qty" type="number" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.unitPrice`}
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className={'text-nowrap'}>Unit Price</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Unit Price" type="number" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.discount`}
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Discount</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Discount" type="number" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.tax`}
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Tax</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Tax" type="number" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                variant="outline"
                                                type="button"
                                                disabled={watchedItems.length <= 1}
                                                onClick={() => remove(index)}
                                                className="mt-1 md:mt-[32px] mr-full md:mr-0"
                                            >
                                                <TrashIcon size={18} className={'stroke-red-500'}/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    </Card>
                )}

                <div className={'flex justify-end w-full p-2'}>
                    <Button
                        type="button" variant={'outline'}
                        onClick={() => append({
                            qty: '1', tax: '0', description: '', discount: '0', unitPrice: '1'
                        })}
                    >
                        Add Item
                    </Button>
                </div>

                <div className={'flex w-full justify-end'}>
                    <Card className={'mt-0  md:w-min w-full'}>
                        <Table className={'max-w-[400px] md:min-w-[400px] '}>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold h-15">Amount Without Tax: </TableCell>
                                    <TableCell
                                        className={'text-right h-15'}>{Math.max(truncateNumberByLength(totals.amountWithoutTax, 8), 0)} BTT</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold h-15">Total Tax Amount: </TableCell>
                                    <TableCell
                                        className={'text-right h-15'}>{Math.max(truncateNumberByLength(totals.amountWithoutTax, 8), 0)} BTT</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Badge className={' font-semibold text-xl w-full flex justify-between'}>
                            <div>Total:</div>
                            <div>{Math.max(truncateNumberByLength(totals.totalAmount, 8), 0)} BTT</div>
                        </Badge>
                    </Card>
                </div>

                <div className={'flex justify-end'}>
                    <Button
                        className={'mt-4 '}
                        disabled={isLoadingCreatePayment} isLoading={isLoadingCreatePayment}
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}
