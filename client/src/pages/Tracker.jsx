
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Tracker.css';
import BudgetChart from '../components/BudgetChart';
import BudgetSummary from '../components/BudgetSummary';

const Tracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.createdAt);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return (
      (!selectedMonth || selectedMonth === month) &&
      (!selectedYear || selectedYear === year)
    );
  });

  const total = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const safeBudget = isNaN(Number(budget)) ? 0 : Number(budget);
  const remaining = safeBudget - total;

  return (
    <div className="tracker-container">
      <h2>Monthly Expense Tracker</h2>

      {/* Filters */}
      <div className="filter-row">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => {
            const val = String(i + 1).padStart(2, '0');
            return (
              <option key={val} value={val}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            );
          })}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={String(year)}>{year}</option>
          ))}
        </select>
      </div>

      {/* Budget Input */}
      <input
        type="number"
        placeholder="Enter your monthly budget (₹)"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="budget-input"
      />

      {/* Summary and Chart */}
      <BudgetSummary total={total} remaining={remaining} budget={safeBudget} />
      <BudgetChart budget={safeBudget} total={total} remaining={remaining} />
    </div>
  );
};

export default Tracker;
