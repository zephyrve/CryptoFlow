import React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend, LegendProps,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";
import useUserStatisticsStore from "@/stores/userStatisticsStore";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ChartData, COLORSD, Transaction} from "@/app/(privates)/statistics/components/Charts";
import {Badge} from "@/components/ui/badge";

const CustomLegend: React.FC<LegendProps> = (props) => {
    const {payload} = props;
    return (
        <div style={{listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'center', gap: 0}}
             className={'flex items-center align-middle'}>
            {payload?.map((entry, index) => (
                <div className={'flex font-[600] uppercase  gap-4'} key={`item-${index}`} style={{color: entry.color}}>
                    <Badge variant={'outline'} style={{color: entry.color}}>
                        {entry.value}
                    </Badge>
                </div>
            ))}
        </div>
    );
};


const CustomTooltipCount: React.FC<TooltipProps<any, any>> = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                padding: '7px',
                borderRadius: '5px',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: 13
            }}>
                <p className="label text-muted-foreground">{`Date: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{color: entry.color}}>
                        {`${entry.name?.split('-').join(' ')}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }

    return null;
};


export const TotalTransactionAmountsChart: React.FC = () => {
    const {data} = useUserStatisticsStore();

    const prepareChartData = (transactionHistory: Transaction[]) => {
        if (!transactionHistory || transactionHistory.length === 0) {
            return [];
        }

        const sortedTransactionHistory = [...transactionHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const chartData: { [key: string]: ChartData } = {};
        // @ts-ignore
        const transactionTypes = [...new Set(sortedTransactionHistory.map(tx => tx.type))];

        sortedTransactionHistory.forEach(({type, timestamp}) => {
            const date = new Date(timestamp).toISOString().split('T')[0];

            if (!chartData[date]) {
                // @ts-ignore
                chartData[date] = {name: date};
                transactionTypes.forEach(t => {
                    chartData[date][t] = 0;
                });
            }
            // @ts-ignore
            chartData[date][type] += 1;
        });

        return Object.values(chartData);
    };
    // @ts-ignore
    const chartData = prepareChartData(data.transactionHistory);
    // @ts-ignore
    const transactionTypes = [...new Set(data.transactionHistory.map(tx => tx.type))];

    return (
        <Card className={'w-full overflow-hidden border-none'}>
            <CardHeader
                className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
            >
                Transaction Count by Category
            </CardHeader>
            <CardContent>
                {data.transactionHistory.length !== 0 &&
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis tickCount={data.transactionHistory.length} interval={1}/>
                            <Tooltip content={<CustomTooltipCount/>}/>
                            {transactionTypes.map((type, index) => (
                                <Area
                                    key={type}
                                    type="monotone"
                                    dataKey={type}
                                    stroke={COLORSD[index % COLORSD.length]}
                                    fill={COLORSD[index % COLORSD.length]}
                                    fillOpacity={0.3}
                                />
                            ))}
                            <Legend content={<CustomLegend/>}/>
                        </AreaChart>
                    </ResponsiveContainer>
                }
            </CardContent>
        </Card>
    );
};