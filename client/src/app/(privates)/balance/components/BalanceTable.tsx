import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {truncateNumberByLength} from "@/utils/funstions";
import {Badge} from "@/components/ui/badge";
import {useWalletStore} from "@/stores/useWalletStore";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {cn} from "@/utils/styles";
import React from "react";
import Loader from "@/components/share/Loader";
import {Alert, AlertDescription} from "@/components/ui/alert";

export function BalanceTable() {
    const {balances, isLoadingBalance} = useWalletStore()

    return (
        <>
            <Loader className={'flex justify-center'} isShow={isLoadingBalance && balances?.length === 0}/>

            {!isLoadingBalance && balances?.length === 0 &&
                <Alert>
                    <AlertDescription>No token balances available</AlertDescription>
                </Alert>
            }

            {balances?.length > 0 &&
                <div className="flex ">
                    <ScrollArea type="always" className="w-1 flex-1">
                        <div className="flex gap-2">
                            <Table className={'min-w-[450px]'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Token</TableHead>
                                        <TableHead>Balance</TableHead>
                                        <TableHead>Locked Amount</TableHead>
                                        <TableHead className="text-right">Available Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {balances.map((token, index) => (
                                        <TableRow
                                            className={cn({'bg-muted': index % 2 == 0})}
                                            key={token.name}>
                                            <TableCell className="font-medium">
                                                <Badge variant={'secondary'} className={'text-[15px]'}>
                                                    {token.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={'text-[15px]'} variant={'outline'}>
                                                    {token.balance}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={'text-[15px]'} variant={'outline'}>
                                                    {token.lockedAmount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={'default'} className={'text-[15px]'}>
                                                    {truncateNumberByLength(token.balance - token.lockedAmount, 6)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </div>
            }
        </>
    )
}
