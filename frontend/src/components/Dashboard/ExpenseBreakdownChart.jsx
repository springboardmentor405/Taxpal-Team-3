import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../../sass/ExpenseBreakdownChart.scss';

const data = [
    { name: 'Marketing', value: 25 },
    { name: 'Other', value: 25 },
    { name: 'Rent', value: 20 },
    { name: 'Food', value: 15 },
    { name: 'Software', value: 15 },
];

const COLORS = ['#0A0A3A', '#FF8B8B', '#42D2CE', '#FFA62B', '#4C6FFF'];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
            {name}
        </text>
    );
};


const ExpenseBreakdownChart = () => {
    return (
        <div className="chart-card expense-breakdown-chart">
            <div className="chart-header">
                <h3>Expense Breakdown</h3>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={0}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={0}
                            labelLine={true}
                            label={CustomLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExpenseBreakdownChart;
