const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Important: Put this above '/:id' route
router.get('/total/expense', protect, getTotalExpense);

// ✅ Routes for fetching/creating expenses
router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

// ✅ Route for updating/deleting specific expense
router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
