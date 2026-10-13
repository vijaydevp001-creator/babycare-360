require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../backend/config/database');
const errorHandler = require('../backend/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/children', require('../backend/routes/children'));
app.use('/api/growth', require('../backend/routes/growth'));
app.use('/api/vaccines', require('../backend/routes/vaccines'));
app.use('/api/appointments', require('../backend/routes/appointments'));
app.use('/api/nutrition', require('../backend/routes/nutrition'));

// Error handling middleware - MUST be last
app.use(errorHandler);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Baby360 API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the API. Check MONGO_URI and ensure MongoDB is reachable:', error);
    process.exitCode = 1;
  }
};

startServer();