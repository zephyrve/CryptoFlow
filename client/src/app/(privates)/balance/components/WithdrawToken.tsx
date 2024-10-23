"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {bttcTestnet} from "@/config/wagmi";
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useWalletStore} from "@/stores/useWalletStore";
import {toast} from "sonner";
import {DEFAUL_TOKENS, DEFAULT_CHAIN, DEFAULT_CHAIN_ID, whiteListTokenOfChain} from "@/utils/chainSettings";
import Link from "next/link";
import {shortAddress} from "@/utils/funstions";
import {withdrawAmount} from "@/app/(privates)/balance/api-balance";

const FormSchema = z.object({
    amount: z.string()
        .refine((value) => Number(value) > 0, {
            message: "Amount must be greater than 0",
        }),
    tokenAddress: z.string()
})

const initialFormData = {
    amount: "",
    tokenAddress: CONTRACT_ADDRESS
}

export function WithdrawToken() {
    const {address, chain, chainId} = useAccount()
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false)
    const {decrementBalance} = useWalletStore()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialFormData
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingDeposit(true)
            const transaction = await withdrawAmount({address: address as `0x${string}`, amount: data.amount})

            toast.success(<div className={'flex flex-col justify-start gap-2'}>
                <div className={'font-bold'}>Withdrawal completed successfully!</div>
                <Link target={'_blank'}
                      href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                    {shortAddress(transaction?.transactionHash)}
                </Link>
            </div>)

            decrementBalance({
                tokenAddress: DEFAULT_CHAIN.contractAddress!,
                amount: parseFloat(data.amount.toString())
            })

            form.reset(initialFormData)
        } catch (e: any) {
            if (e?.shortMessage) {
                if (e?.shortMessage.includes('amount>balance')) toast.error('Withdrawal amount exceeds your current balance. Please enter a valid amount!')
                else (toast.error(e?.shortMessage))
            } else toast.error(e?.message);
        } finally {
            setIsLoadingDeposit(false)
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type={'number'} placeholder="Amount" {...field}/>
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
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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
                    Withdraw
                </Button>
            </form>
        </Form>
    )
}
