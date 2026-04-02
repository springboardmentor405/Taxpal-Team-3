import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../../sass/IncomeExpenseChart.scss';

const defaultData = [
    { name: 'Jan', Income: 7500, Expenses: 2100 },
    { name: 'Feb', Income: 4500, Expenses: 7000 },
    { name: 'Mar', Income: 6800, Expenses: 4900 },
    { name: 'Apr', Income: 4200, Expenses: 5400 },
    { name: 'May', Income: 5000, Expenses: 8200 },
    { name: 'Jun', Income: 3200, Expenses: 7600 },
    { name: 'Jul', Income: 5700, Expenses: 7000 },
    { name: 'Aug', Income: 6500, Expenses: 3100 },
    { name: 'Sept', Income: 1000, Expenses: 2500 },
    { name: 'Oct', Income: 700, Expenses: 400 },
];

const IncomeExpenseChart = ({ data }) => {
    const [months, setMonths] = useState(6);

    const chartData = useMemo(() => {
        // If `data` is provided, even if it's empty, show empty/zero chart instead of fallback.
        const src = data === undefined ? defaultData : (Array.isArray(data) ? data : defaultData);
        return src.slice(Math.max(0, src.length - months));
    }, [data, months]);

    return (
        <div className="chart-card income-expense-chart">
            <div className="chart-header">
                <h3>Income vs Expenses</h3>
                <select
                    className="period-select"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                >
                    <option value="6">Last 6 months</option>
                    <option value="12">Last 12 months</option>
                </select>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                        barGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e0e0e0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                        <Tooltip 
                            cursor={{ fill: '#f5f5f5' }} 
                            formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                        />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar dataKey="Expenses" fill="#0A0A3A" radius={[2, 2, 0, 0]} barSize={12} />
                        <Bar dataKey="Income" fill="#42D2CE" radius={[2, 2, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeExpenseChart;
