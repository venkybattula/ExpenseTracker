import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  budget: '#2196f3',
  spent: '#f44336',
  remaining: '#4caf50',
};

const BudgetChart = ({ budget, total, remaining }) => {
  const chartData = [
    { name: 'Budget', value: budget, color: COLORS.budget },
    { name: 'Spent', value: total, color: COLORS.spent },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0, color: COLORS.remaining },
  ];

  return (
    <div className="circle-chart-box">
      <h3>Visual Expense Tracker</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          {/* Budget Outer */}
          <Pie
            data={[chartData[0]]}
            dataKey="value"
            outerRadius={140}
            labelLine={false}
            label={({ value }) => `₹${value}`}
          >
            <Cell fill={chartData[0].color} />
          </Pie>

          {/* Spent Middle */}
          <Pie
            data={[chartData[1]]}
            dataKey="value"
            innerRadius={90}
            outerRadius={115}
            labelLine={false}
            label={({ value }) => `₹${value}`}
          >
            <Cell fill={chartData[1].color} />
          </Pie>

          {/* Remaining Inner */}
          <Pie
            data={[chartData[2]]}
            dataKey="value"
            innerRadius={50}
            outerRadius={70}
            labelLine={false}
            label={({ value }) => `₹${value}`}
          >
            <Cell fill={chartData[2].color} />
          </Pie>

          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
