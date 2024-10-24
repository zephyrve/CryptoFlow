import React from 'react';
import {TransactionCountChart} from "@/app/(privates)/statistics/components/ChartAmountVolume";
import {TotalTransactionAmountsChart} from "@/app/(privates)/statistics/components/ChartTransactionCount";

export const COLORSD = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#FF5733', // Tomato
    '#C70039', // Crimson
    '#FFC300', // Golden
    '#581845', // Dark Purple
    '#DAF7A6', // Light Green
    '#900C3F', // Dark Red
    '#581845', // Dark Purple
    '#1F618D', // Dark Blue
    '#45B39D', // Dark Teal
    '#F39C12', // Dark Yellow
    '#2980B9', // Blue
    '#8E44AD', // Purple
    '#D35400', // Orange
    '#C0392B', // Red
]

export interface Transaction {
    transactionHash: string;
    amount: number;
    type: string;
    status: 'success' | 'failed';
    timestamp: Date;
}

export interface ChartData {
    date: string;

    [key: string]: number | string;
}

const Stats: React.FC = () => {
    return (
        <div className={'flex flex-col gap-4 w-full'}>
            <TransactionCountChart/>
            <TotalTransactionAmountsChart/>
        </div>
    );
};

export default Stats;
