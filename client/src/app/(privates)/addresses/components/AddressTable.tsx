'use client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {shortAddress} from "@/utils/funstions";
import {AddressType, useAddressesStore} from "@/stores/useAddressesStore";
import Link from "next/link";
import {chains} from "@/utils/chainSettings";
import {useAccount} from "wagmi";
import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from "lucide-react";
import {useGroupsStore} from "@/stores/useGroupsStore";
import DeleteAddressModal from "@/app/(privates)/addresses/components/DeleteAddressModal";
import {cn} from "@/utils/styles";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import EditAddressModal from "@/app/(privates)/addresses/components/EditAddressModal";
import React, {useCallback, useEffect} from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import Loader from "@/components/share/Loader";
import {Alert, AlertDescription} from "@/components/ui/alert";

export function AddressTable() {
    const {
        addresses,
        isLoadingAddresses,
        setIsOpenDeleteModal,
        setIsOpenEditModal,
        setSelectedAddress
    } = useAddressesStore()
    const {chainId} = useAccount()
    const {groupMap, groups, createGroupMap} = useGroupsStore()

    const onOpenDeleteAddressModal = useCallback(
        (addressBook: AddressType) => () => {
            setIsOpenDeleteModal(true);
            setSelectedAddress(addressBook);
        },
        []
    );

    const onOpenEditAddressModal = useCallback(
        (addressBook: AddressType) => () => {
            setIsOpenEditModal(true);
            setSelectedAddress(addressBook);
        },
        []
    );

    useEffect(() => {
        createGroupMap()
    }, [groups]);

    return (
        <>
            <Loader className={'flex justify-center py-2'} isShow={isLoadingAddresses && addresses?.length === 0}/>

            {!isLoadingAddresses && addresses?.length === 0 &&
                <Alert>
                    <AlertDescription>No addresses have been saved</AlertDescription>
                </Alert>
            }

            <DeleteAddressModal/>
            <EditAddressModal/>

            {addresses?.length > 0 &&
                <div className="flex ">
                    <ScrollArea type="always" className="w-1 flex-1">
                        <div className="flex gap-2">
                            <Table className={'min-w-[650px]'}>
                                <TableHeader className={' table-header border-none'}>
                                    <TableRow className={' border-none'}>
                                        <TableHead className="w-[100px]">Full Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Group</TableHead>
                                        <TableHead className="text-right "></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className={' table-body  '}>
                                    {addresses?.map((addressBook, index) => (
                                        <TableRow
                                            className={cn({'bg-muted': index % 2 == 0})}
                                            key={addressBook._id}
                                        >
                                            <TableCell className=" font-medium">
                                                <div
                                                    className={'font-semibold text-md break-all w-[150px] max-w-[150px]'}>
                                                    {addressBook.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {chainId && chains[chainId] &&
                                                    <Link
                                                        target="_blank"
                                                        href={chains[chainId].explorer
                                                            .concat("address/")
                                                            .concat(addressBook.walletAddress)}
                                                    >
                                                        <Badge className={'font-medium text-md'} variant={'secondary'}>
                                                            {shortAddress(addressBook.walletAddress)}
                                                        </Badge>
                                                    </Link>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={'font-medium text-md'} variant={'outline'}>
                                                    {addressBook.email}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(groupMap && addressBook.groupId && groupMap[addressBook.groupId])
                                                    ? <div
                                                        className={'font-medium text-md break-all w-[300px] max-w-[300px]'}>
                                                        {groupMap[addressBook.groupId]}
                                                    </div>
                                                    : <></>
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className={'mr-3 px-2'}>
                                                        <EllipsisVerticalIcon/>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={'end'}>
                                                        <DropdownMenuItem
                                                            className={'flex items-center align-middle gap-2'}
                                                            onClick={onOpenDeleteAddressModal(addressBook)}>
                                                            <TrashIcon size={15}/> Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={'flex items-center align-middle gap-2'}
                                                            onClick={onOpenEditAddressModal(addressBook)}>
                                                            <PencilIcon size={15}/> Edit
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
