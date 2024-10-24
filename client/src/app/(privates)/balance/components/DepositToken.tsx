"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount, useBalance} from "wagmi";
import {DEFAUL_TOKENS, DEFAULT_CHAIN, whiteListTokenOfChain} from "@/utils/chainSettings";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useWalletStore} from "@/stores/useWalletStore";
import {toast} from "sonner";
import {depositAmount} from "@/app/(privates)/balance/api-balance";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";

const FormSchema = z.object({
    tokenAddress: z.string(),
    amount: z.string()
        .refine((value) => Number(value) > 0, {
            message: "Amount must be greater than 0",
        }),
})

const initialFormData = {
    amount: "",
    tokenAddress: CONTRACT_ADDRESS
}

const targetChainId = 1029;

export function DepositToken() {
    const {address, chainId, chain} = useAccount()
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false)
    const {incrementBalance, getBalances, balances} = useWalletStore()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    const {data, refetch} = useBalance({
        address: form.getValues().tokenAddress as any
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (chain?.id !== targetChainId) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingDeposit(true)
            const transaction = await depositAmount({address: address as `0x${string}`, amount: data.amount})

            toast.success(<div className={'flex flex-col justify-start gap-2'}>
                <div className={'font-bold'}>Deposit completed successfully!</div>
                <Link target={'_blank'}
                      href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                    {shortAddress(transaction?.transactionHash)}
                </Link>
            </div>)

            if (balances.length === 0)
                await getBalances({address: address!})

            incrementBalance({
                tokenAddress: DEFAULT_CHAIN.contractAddress!,
                amount: parseFloat(data.amount.toString())
            })

            form.reset(initialFormData)
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) toast.error(e?.shortMessage);
            else toast.error(e?.message);
        } finally {
            setIsLoadingDeposit(false)
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    max={data?.value ? parseFloat(data?.value.toString()) : undefined}
                                    type={'number'}
                                    placeholder="Amount"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tokenAddress"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Token</FormLabel>
                            <Select
                                defaultValue={field.value}
                                onValueChange={(e) => {
                                    field.onChange(e)
                                    refetch()
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Token"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {chainId && (whiteListTokenOfChain[chainId] ?? DEFAUL_TOKENS)?.map((token, index) => (
                                        <SelectItem
                                            key={`${token.symbol}`}
                                            value={token.address}
                                        >
                                            {token.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={isLoadingDeposit}
                    isLoading={isLoadingDeposit}
                    type="submit"
                >
                    Deposit
                </Button>
            </form>
        </Form>
    )
}
