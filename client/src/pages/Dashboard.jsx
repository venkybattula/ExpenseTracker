
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63', '#9C27B0'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const filtered = expenses.filter((exp) => {
      const date = new Date(exp.date || exp.createdAt);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());

      const matchMonthYear =
        (!selectedMonth || selectedMonth === month) &&
        (!selectedYear || selectedYear === year);

      const matchFrom = fromDate ? date >= new Date(fromDate) : true;
      const matchTo = toDate ? date <= new Date(toDate) : true;

      return matchMonthYear && matchFrom && matchTo;
    });

    setFilteredExpenses(filtered);
  }, [expenses, selectedMonth, selectedYear, fromDate, toDate]);

  const categoryData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
      acc[curr.category].value += parseFloat(curr.amount);
      return acc;
    }, {})
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const thisMonthTotal = expenses
    .filter((exp) => {
      const date = new Date(exp.date || exp.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0)
    .toFixed(2);

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard</h2>

      <div className="filter-controls">
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

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <button
          onClick={() => {
            setSelectedMonth('');
            setSelectedYear('');
            setFromDate('');
            setToDate('');
          }}
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>

      <div className="tracker-toggle">
        <button onClick={() => navigate('/tracker')} className="btn-go-tracker">
          Go to Tracker
        </button>
      </div>

      <div className="summary-bar">
        <p><strong>🗓️ This Month's Total:</strong> ₹{thisMonthTotal}</p>
      </div>

      {categoryData.length > 0 && (
        <div className="charts-section">
          <div className="chart-box">
            <h3>📊 Category Pie Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>📊 Category Bar Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" label={{ position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="expense-list-section">
        <h3>💸 Expense Details</h3>
        {filteredExpenses.length === 0 ? (
          <p className="no-expenses">No expenses found for the selected filters.</p>
        ) : (
          filteredExpenses.map((exp) => (
            <div key={exp._id} className="expense-card">
              <div className="expense-header">
                <h4>{exp.title}</h4>
                <span className="amount">₹{Number(exp.amount).toFixed(2)}</span>
              </div>
              <div className="expense-meta">
                <span>{new Date(exp.date || exp.createdAt).toLocaleDateString()}</span>
                <span className="category-badge">{exp.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
