'use client'
import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {AddressTable} from "@/app/(privates)/addresses/components/AddressTable";
import CreateAddress from "@/app/(privates)/addresses/components/CreateAddress";

const Page = () => {

    return (
        <div className={'flex gap-2 flex-col w-full'}>
            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Create Address
                </CardHeader>
                <CardContent>
                    <CreateAddress/>
                </CardContent>
            </Card>

            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Addresses
                </CardHeader>
                <CardContent>
                    <Card>
                        <AddressTable/>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;