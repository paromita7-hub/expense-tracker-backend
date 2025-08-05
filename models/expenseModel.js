const mongoose = require('mongoose');

const allowedCategories = [
  'Basic',
  'Essential',
  'Conditionally Essential',
  'Non-Essential'
];

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word =>
      word
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-')
    )
    .join(' ');
}


const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    validate: {
      validator: function (value) {
        return allowedCategories.includes(toTitleCase(value));
      },
      message: props => `${props.value} is not a valid category.`,
    },
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// ✅ Normalize category on document save
expenseSchema.pre('save', function (next) {
  if (this.category) {
    this.category = toTitleCase(this.category);
  }
  next();
});

// ✅ Normalize category on update (important for findOneAndUpdate)
expenseSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.category) {
    update.category = toTitleCase(update.category);
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
