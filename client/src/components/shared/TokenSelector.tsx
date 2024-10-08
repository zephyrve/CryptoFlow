import {InputGroup, InputLeftAddon, Select, useColorModeValue} from "@chakra-ui/react";
import {useEffect} from "react";
import {whiteListTokenOfChain} from "@/config/whitelistTokens";
import {getBalanceThunk} from "@/stores/balance/getBalanceThunk";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {BsCurrencyDollar} from "react-icons/bs";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const TokenSelector = ({handleOnChange}: any) => {
    const dispatch = useAppDispatch();
    const {tokenBalances} = useAppSelector((state) => state.balance);
    const {account, chainId} = useMetaMask()

    useEffect(() => {
        dispatch(getBalanceThunk(account));
    }, [account]);

    return (
        <InputGroup size={'md'}>
            <InputLeftAddon>
                <BsCurrencyDollar color={useColorModeValue('gray', 'gray')}/>
            </InputLeftAddon>
            {chainId &&
                <Select
                    required
                    onChange={(e) => handleOnChange("tokenAddress", e.target.value)}
                >
                    {whiteListTokenOfChain[chainId].map((token) => {
                        const tokenBalance = tokenBalances.filter(
                            (i) => i.address == token.address,
                        );
                        let availableAmount = 0;
                        if (tokenBalance.length) {
                            availableAmount =
                                tokenBalance[0].balance - tokenBalance[0].lockedAmount;
                        }
                        return (
                            <option key={`option-${token.symbol}`} value={token.address}>
                                {token.name} ({availableAmount})
                            </option>
                        );
                    })}
                </Select>
            }
        </InputGroup>
    );
}

export default TokenSelector