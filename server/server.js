
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Basic health check route
// app.get('/', (req, res) => {
//   res.json({ message: 'Server is running!' });
// });

// // Load routes with try-catch blocks
// try {
//   app.use('/api/auth', require('./routes/authRoutes'));
// } catch (error) {
//   console.error('Error loading auth routes:', error.message);
// }

// try {
//   app.use('/api/expenses', require('./routes/expenseRoutes'));
// } catch (error) {
//   console.error('Error loading expense routes:', error.message);
// }

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ message: 'Internal server error' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'https://expensetracker-frontend-g1wo.onrender.com',
  credentials: true,
}));

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Load routes with try-catch blocks
try {
  app.use('/api/auth', require('./routes/authRoutes'));
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  app.use('/api/expenses', require('./routes/expenseRoutes'));
} catch (error) {
  console.error('Error loading expense routes:', error.message);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});