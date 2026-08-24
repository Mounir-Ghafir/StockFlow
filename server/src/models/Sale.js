const mongoose = require('mongoose');

const decimalToNumber = (value) => (value == null ? value : Number(value.toString()));

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: decimalToNumber,
    },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'A sale must contain at least one item',
      },
    },
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: decimalToNumber,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model('Sale', saleSchema);
