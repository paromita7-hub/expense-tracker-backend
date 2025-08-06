// ✅ server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://genuine-piroshki-92cb57.netlify.app'], // replace with your actual frontend Netlify URL
  credentials: true,
}));

// ✅ Body Parser
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
