import {
    BookUser,
    BarChart3,
    FileDown,
    FilePenLine,
    Files,
    FileUp,
    History,
    Send,
    Users,
    Wallet,
    ArrowRightLeft,
    RepeatIcon,
    ReceiptIcon,
    FileTextIcon
} from "lucide-react";
import React from "react";

export const NavLinks = [
    {
        group: 'Main',
        links: [
            {
                path: '/balance',
                name: 'Balance',
                icon: <Wallet className="h-4 w-4"/>
            },
            {
                path: '/groups',
                name: 'Groups',
                icon: <Users className="h-4 w-4"/>
            },
            {
                path: '/addresses',
                name: 'Addresses',
                icon: <BookUser className="h-4 w-4"/>
            },
            {
                path: '/statistics',
                name: 'Statistics',
                icon: <BarChart3 className="h-4 w-4"/>
            },
        ]
    },
    {
        group: 'Payments',
        links: [
            {
                path: '/payment/sent',
                name: 'Sent Payments',
                icon: <Send className="h-4 w-4"/>
            },
            {
                path: '/payment/received',
                name: 'Received Payments',
                icon: <ArrowRightLeft className="h-4 w-4"/>
            },
            {
                path: '/payment/one-time',
                name: 'One-Time Payment',
                icon: <FileTextIcon className="h-4 w-4"/>
            },
            {
                path: '/payment/recurring',
                name: 'Recurring Payment',
                icon: <RepeatIcon className="h-4 w-4"/>
            },
        ]
    },
    {
        group: 'Invoices',
        links: [
            {
                path: '/invoice/create',
                name: 'Create Invoice',
                icon: <FilePenLine className="h-4 w-4"/>
            },
            {
                path: '/invoice/send',
                name: 'Send Invoices',
                icon: <FileUp className="h-4 w-4"/>
            },
            {
                path: '/invoice/received',
                name: 'Received Invoices',
                icon: <ReceiptIcon className="h-4 w-4"/>
            },
        ]
    },
];