const mongoose = require('mongoose');

const decimalToNumber = (value) => (value == null ? value : Number(value.toString()));

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: decimalToNumber,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model('Product', productSchema);
