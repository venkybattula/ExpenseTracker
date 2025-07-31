
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/AddExpense.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');
console.log(token);
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 
const handleSubmit = async (e) => { // ✅ async added here
  e.preventDefault();
  try {
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/expenses/${editId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Expense Updated!');
    } else {
      await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Expense Added & Email Sent!');
    }

    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
    setEditId(null);
    fetchExpenses();
  } catch (err) {
    console.error('Error submitting expense:', err);
    toast.error('❌ Failed to add expense');
  }
};

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date || expense.createdAt).toISOString().split('T')[0],
    });
    setIsEditing(true);
    setEditId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error('🗑️ Expense Deleted!');
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0).toFixed(2);
  const average = (total / expenses.length || 0).toFixed(2);

  const thisMonthTotal = expenses
    .filter((exp) => {
      const date = new Date(exp.date || exp.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, exp) => sum + Number(exp.amount), 0)
    .toFixed(2);

  return (
    <div className="add-expense-container">
      <h1 className="page-title">💰 Expense Tracker</h1>

      <div className="stats-grid">
        <div className="stat-card purple"><p>Total Expenses</p><h2>₹{total}</h2></div>
        <div className="stat-card teal"><p>This Month</p><h2>₹{thisMonthTotal}</h2></div>
        <div className="stat-card orange"><p>Average Expense</p><h2>₹{average}</h2></div>
        <div className="stat-card pink"><p>Total Transactions</p><h2>{expenses.length}</h2></div>
      </div>

      <form onSubmit={handleSubmit} className="expense-form-card">
        <h3>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount (₹)"
            required
          />
        </div>

        <div className="form-group">
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transportation">🚗 Transportation</option>
            <option value="Entertainment">🎮 Entertainment</option>
            <option value="Health">🏥 Health</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Rent">🏠 Rent</option>
            <option value="Utilities">💡 Utilities</option>
            <option value="Education">📚 Education</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Salary">💼 Salary</option>
            <option value="Investment">📈 Investment</option>
            <option value="Others">🔖 Others</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setEditId(null);
                setFormData({
                  title: '',
                  amount: '',
                  category: '',
                  date: new Date().toISOString().split('T')[0],
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="expense-list">
        <h3>Recent Expenses</h3>
        {expenses.length === 0 && <p>No expenses added yet.</p>}
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-item">
            <div>
              <strong>{expense.title}</strong> - ₹{expense.amount} ({expense.category}) on{' '}
              {new Date(expense.date || expense.createdAt).toLocaleDateString()}
            </div>
            <div className="expense-actions">
              <button className="edit-btn" onClick={() => handleEdit(expense)}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(expense._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddExpense;
