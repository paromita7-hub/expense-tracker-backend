const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpense, // ✅ ADD THIS
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);
// ✅ ADD THIS ROUTE
router.get('/total/expense', protect, getTotalExpense);
module.exports = router;
