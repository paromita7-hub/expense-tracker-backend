const Expense = require('../models/expenseModel');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addExpense = async (req, res) => {
  const { description, amount, category } = req.body;

  if (!description || !amount) {
    return res.status(400).json({ message: 'Please add description and amount' });
  }

  try {
    const expense = new Expense({
      user: req.user.id,
      description,
      amount,
      category,
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error saving expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  const { description, amount, category } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;

    const updated = await expense.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
};
