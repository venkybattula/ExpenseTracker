
const Expense = require('../models/Expense');
const User = require('../models/User');
const sendEmail = require('../utils/sendExpenseEmail');


exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      user: req.user.id,
      date: date ? new Date(date) : new Date()
    });

    await newExpense.save();

    // ✅ Respond immediately before sending the email
    res.status(201).json({
      message: 'Expense added successfully',
      expense: newExpense,
    });

    // ✅ Email is sent AFTER response
    User.findById(req.user.id)
      .then((user) => {
        if (user && user.email) {
          const subject = '🧾 New Expense Added';
          const text = `
Hi ${user.name || 'User'},

You added a new expense:
- Title: ${title}
- Amount: ₹${amount}
- Category: ${category || 'General'}
- Date: ${new Date(date || new Date()).toLocaleDateString()}

Keep tracking!

- Expense Tracker Team`;

          sendEmail({ to: user.email, subject, text }).catch((emailErr) =>
            console.warn('Email send failed:', emailErr.message)
          );
        }
      })
      .catch((err) => console.error('Error fetching user for email:', err));

  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};

// @desc    Get all expenses of the logged-in user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense' });
  }
};

// @desc    Update expense by ID
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this expense' });
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;

    if (date) {
      expense.date = new Date(date);
    }

    await expense.save();

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// @desc    Delete expense by ID
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this expense' });
    }

    await expense.deleteOne();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
