import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const TimeSeriesChart = ({chartData, yAxisLabel = "Цена на последна трансакција (MKD)" }) => {
    const formatXAxis = (tick) => {
        const date = new Date(tick);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    const formatYAxis = (tick) => {
    return `${new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(tick)} МКД`;
};


    return (
        <div>
            {chartData.length > 0 ? (
                <LineChart
                    width={800}
                    height={400}
                    data={chartData}
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatXAxis}
                        label={{value: "Date", position: "insideBottom", offset: 0}}
                    />
                    <YAxis
                        tickFormatter={formatYAxis}
                        label={{value: "Цена на последна трансакција (MKD)", angle: -45, position: "insideLeft", offset: -20}}
                    />
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="value" stroke="#8884d8"/>
                </LineChart>
            ) : (
                <p>No data available for the selected inputs.</p>
            )}
        </div>
    );
};

export default TimeSeriesChart;