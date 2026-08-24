const mongoose = require('mongoose');

const decimalToNumber = (value) => (value == null ? value : Number(value.toString()));

const purchaseOrderItemSchema = new mongoose.Schema(
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
    unitCost: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: decimalToNumber,
    },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    items: {
      type: [purchaseOrderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'A purchase order must contain at least one item',
      },
    },
    status: {
      type: String,
      enum: ['Draft', 'Ordered', 'Received', 'Cancelled'],
      default: 'Draft',
      required: true,
    },
    expectedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
