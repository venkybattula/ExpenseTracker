import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpenseForm.css';

const DeleteExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setExpenses(res.data));
  }, [token]);

  const deleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Deleted successfully');
      setExpenses(expenses.filter(e => e._id !== id));
    }
  };

  return (
    <div className="expense-page">
      <h2>Delete Expenses</h2>
      <p>Select an item below to remove it from your tracker.</p>
      {expenses.map((exp) => (
        <div key={exp._id} className="expense-item">
          <strong>{exp.title}</strong> - ₹{exp.amount}
          <button onClick={() => deleteExpense(exp._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default DeleteExpense;
