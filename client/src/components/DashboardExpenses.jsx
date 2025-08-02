
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './DashboardExpenses.css';

const categoryIcons = {
  'Food': '🍔',
  'Transportation': '🚗',
  'Entertainment': '🎮',
  'Health': '🏥',
  'Shopping': '🛍️',
  'Rent': '🏠',
  'Utilities': '💡',
  'Education': '📚',
  'Travel': '✈️',
  'Salary': '💼',
  'Investment': '📈',
  'Others': '🔖'
};

const DashboardExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    from: '',
    to: ''
  });

  const token = localStorage.getItem('token');

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses', err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleEdit = (expense) => {
    console.log('Editing', expense);
    // You can open a modal or navigate to edit page
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.createdAt).toISOString().split('T')[0];
    return (
      (!filters.category || exp.category === filters.category) &&
      (!filters.from || filters.from <= date) &&
      (!filters.to || filters.to >= date)
    );
  });

  return (
    <div className="dashboard-expense-container">
      <h2>📊 Your Expenses</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>
              {categoryIcons[cat]} {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />

        <button
          className="clear-btn"
          onClick={() => setFilters({ category: '', from: '', to: '' })}
        >
          Clear Filters
        </button>
      </div>

      {/* Expense Cards */}
      <div className="expense-cards">
        {filteredExpenses.length === 0 ? (
          <p className="no-expenses">No expenses found for the selected filters.</p>
        ) : (
          filteredExpenses.map((exp) => (
            <div className="expense-card" key={exp._id}>
              <div className="expense-left">
                <h4 className="expense-title">{exp.title}</h4>
                <div className="expense-meta">
                  <span className="expense-date">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </span>
                  <span className="category-badge">
                    {categoryIcons[exp.category] || '🔖'} {exp.category}
                  </span>
                </div>
              </div>
              <div className="expense-right">
                <span className={`amount ${Number(exp.amount) === 0 ? 'zero' : ''}`}>
                  ₹{Number(exp.amount).toFixed(2)}
                </span>
                <div className="expense-actions">
                  <button className="edit" onClick={() => handleEdit(exp)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(exp._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardExpenses;
