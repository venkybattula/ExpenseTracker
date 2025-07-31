
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AddExpense.css';
import axios from 'axios';

const EditExpense = () => {
  const { id } = useParams(); // Get the expense ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: ''
  });

  const token = localStorage.getItem('token');

  // Fetch existing expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data); // set form with existing data
      } catch (err) {
        console.error('Failed to load expense', err);
      }
    };

    fetchExpense();
  }, [id, token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/expenses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Expense updated successfully!');
      navigate('/dashboard'); // or navigate('/add-expense')
    } catch (err) {
      console.error('Failed to update expense:', err);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          required
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditExpense;
