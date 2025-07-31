const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes below require user to be authenticated
router.post('/', authMiddleware, addExpense);           // POST /api/expenses
router.get('/', authMiddleware, getExpenses);           // GET  /api/expenses
router.get('/:id', authMiddleware, getExpenseById);     // GET  /api/expenses/:id
router.put('/:id', authMiddleware, updateExpense);      // PUT  /api/expenses/:id
router.delete('/:id', authMiddleware, deleteExpense);   // DELETE /api/expenses/:id

module.exports = router;