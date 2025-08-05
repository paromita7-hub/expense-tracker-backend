const Expense = require('../models/expenseModel');

// @desc    Get all expenses for logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Create new expense
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      user: req.user.id,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Create Expense Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    expense.description = description;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// @desc    Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Expense.findByIdAndDelete(req.params.id); // ✅ More reliable
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete Expense Error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};
// @desc    Get total expenses for logged-in user
exports.getTotalExpense = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    const total = result[0]?.totalAmount || 0;
    res.json({ totalExpense: total });
  } catch (error) {
    console.error('Total Expense Error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};
