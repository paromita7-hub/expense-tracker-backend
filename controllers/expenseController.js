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

// @desc    Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

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
    res.status(400).json({ error: 'Invalid data' });
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

    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    await expense.remove();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
