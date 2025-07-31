
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6f61', '#6f42c1', '#17a2b8', '#ffc0cb', '#4caf50'];

const CategoryExpenseChart = ({ expenses }) => {
  const [chartType, setChartType] = useState('pie');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Extract filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = new Date(expense.createdAt);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return (
        (!selectedMonth || month === selectedMonth) &&
        (!selectedYear || year === selectedYear)
      );
    });
  }, [expenses, selectedMonth, selectedYear]);

  const categoryTotals = {};
  filteredExpenses.forEach((exp) => {
    const category = exp.category || 'Uncategorized';
    categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount;
  });

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="chart-container">
      <h3>Category-wise Expense Breakdown</h3>

      <div className="filter-controls">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => {
            const month = String(i + 1).padStart(2, '0');
            return (
              <option key={month} value={month}>
                {new Date(0, i).toLocaleString('default', { month: 'short' })}
              </option>
            );
          })}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {[2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={String(year)}>{year}</option>
          ))}
        </select>

        <button onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}>
          Switch to {chartType === 'pie' ? 'Bar' : 'Pie'}
        </button>
      </div>

      {chartData.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No expenses to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryExpenseChart;
