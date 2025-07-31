
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Serve frontend (for production build)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist'))); // For Vite
  // app.use(express.static(path.join(__dirname, '../client/build'))); // For CRA

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Vite
    // res.sendFile(path.join(__dirname, '../client/build/index.html')); // CRA
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
