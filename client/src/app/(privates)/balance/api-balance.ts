import {client, walletClient} from "@/config/wagmi";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/config/constants";
import {formatUnits, parseUnits} from "viem";
import {DEFAULT_CHAIN, DEFAULT_CHAIN_ID, tokenAddressInfo} from "@/utils/chainSettings";
import {addUserTransaction} from "@/app/(privates)/statistics/api-settings";

export const withdrawAmount = async ({amount, address}: { amount: string, address: `0x${string}` }) => {
    let isSuccess = false;
    let transaction = null
    if (address) {
        const {request} = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'withdrawBalance',
            args: [DEFAULT_CHAIN.contractAddress, parseUnits(amount.toString(), 18)],
            account: address,
        })
        const hash = await walletClient!.writeContract(request)
        transaction =  await client.waitForTransactionReceipt({hash: hash})
        if (transaction) {
            isSuccess = true
        }
    }

    if (transaction) {
        await addUserTransaction({
            walletAddress: address!,
            isSuccess: isSuccess,
            details: {
                amount: parseFloat(amount.toString()),
                type: 'withdraw',
                timestamp: new Date().getTime(),
                transactionHash: transaction?.transactionHash
            }
        })
    }

    return transaction
}

export const depositAmount = async ({amount, address}: { amount: string, address: `0x${string}` }) => {
    let isSuccess = false;
    let transaction = null
    if (address) {
        const {request} = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'deposit',
            args: [DEFAULT_CHAIN.contractAddress, parseUnits(amount.toString(), 18)],
            account: address,
            value: BigInt(parseUnits(amount.toString(), 18))
        })
        const hash = await walletClient!.writeContract(request)
        transaction = await client.waitForTransactionReceipt({hash: hash})
        if (transaction) {
            isSuccess = true
        }
    }
    const timestamp = new Date().getTime() - 4 * 24 * 60 * 60 * 1000;

    if (transaction) {
        await addUserTransaction({
            walletAddress: address!,
            isSuccess: isSuccess,
            details: {
                amount: parseFloat(amount.toString()),
                type: 'deposit',
                timestamp: new Date().getTime(),
                transactionHash: transaction?.transactionHash
            }
        })
    }

    return transaction
}

export type BalanceType = {
    address: string
    balance: number
    lockedAmount: number
    name: string
}
export const getBalance = async ({address}: { address: `0x${string}` }): Promise<any> => {
    try {
        const tempBalances: BalanceType[] = [];

        const tokensBalance: any = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getUserTokensBalance',
            account: address
        })

        for (let i = 0; i < tokensBalance.length; i++) {
            tempBalances.push({
                name: tokenAddressInfo[DEFAULT_CHAIN_ID][tokensBalance[i].tokenAddress].name,
                address: tokensBalance[i].tokenAddress,
                balance: parseFloat(formatUnits(tokensBalance[i].balance, 18)),
                lockedAmount: parseFloat(formatUnits(tokensBalance[i].lockedAmount, 18,)),
            });
        }

        return tempBalances
    } catch (e) {
        console.log(e)
    }
}