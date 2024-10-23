import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useAccount} from "wagmi";
import {useWalletStore} from "@/stores/useWalletStore";
import {truncateNumberByLength} from "@/utils/funstions";
import {whiteListTokenOfChain} from "@/utils/chainSettings";

const TokenBalanceSelect = ({field}: { field: any }) => {
    const {chainId} = useAccount()
    const {balances} = useWalletStore()
    return (
        <>
            <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                {...field}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Token"/>
                </SelectTrigger>
                <SelectContent>
                    {chainId && whiteListTokenOfChain[chainId].map((token) => {
                        const tokenBalance = balances.filter(
                            (i) => i.address == token.address,
                        );
                        let availableAmount = 0;
                        if (tokenBalance.length) {
                            availableAmount =
                                tokenBalance[0].balance - tokenBalance[0].lockedAmount;
                        }
                        return (
                            <SelectItem
                                key={`option-${token.symbol}`}
                                value={token.address}
                            >
                                {token.name} ({truncateNumberByLength(availableAmount, 7)})
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </>
    );
};

export default TokenBalanceSelect;