const Product = require('../models/Product');
const Sale = require('../models/Sale');

const insufficientStock = () => {
  const error = new Error('Insufficient stock');
  error.statusCode = 409;
  return error;
};

const notFound = () => {
  const error = new Error('Sale not found');
  error.statusCode = 404;
  return error;
};

const normalizeItems = (items) => {
  const quantities = new Map();
  items.forEach(({ product, quantity }) => {
    quantities.set(product, (quantities.get(product) || 0) + quantity);
  });
  return quantities;
};

const create = async (employeeId, items) => {
  const quantities = normalizeItems(items);
  const productIds = [...quantities.keys()];
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    const error = new Error('One or more products not found');
    error.statusCode = 404;
    throw error;
  }

  const prices = new Map(products.map((product) => [product._id.toString(), product.price]));
  const decremented = [];
  try {
    for (const [productId, quantity] of quantities) {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, quantityInStock: { $gte: quantity } },
        { $inc: { quantityInStock: -quantity } },
        { returnDocument: 'after' }
      );
      if (!updated) throw insufficientStock();
      decremented.push({ productId, quantity });
    }
  } catch (error) {
    await Promise.all(decremented.map(({ productId, quantity }) => (
      Product.updateOne({ _id: productId }, { $inc: { quantityInStock: quantity } })
    )));
    throw error;
  }

  const saleItems = items.map(({ product, quantity }) => ({
    product,
    quantity,
    unitPrice: prices.get(product),
  }));
  const totalAmount = saleItems.reduce((total, item) => (
    total + Number(item.unitPrice.toString()) * item.quantity
  ), 0);

  try {
    return await Sale.create({ employee: employeeId, items: saleItems, totalAmount });
  } catch (error) {
    await Promise.all([...quantities].map(([productId, quantity]) => (
      Product.updateOne({ _id: productId }, { $inc: { quantityInStock: quantity } })
    )));
    throw error;
  }
};

const list = async (user) => {
  const filter = user.role === 'Admin' ? {} : { employee: user._id };
  return Sale.find(filter)
    .populate('employee', 'name email role')
    .populate('items.product', 'sku name price')
    .sort({ createdAt: -1 });
};

const getById = async (id, user) => {
  const filter = user.role === 'Admin' ? { _id: id } : { _id: id, employee: user._id };
  const sale = await Sale.findOne(filter)
    .populate('employee', 'name email role')
    .populate('items.product', 'sku name price');
  if (!sale) throw notFound();
  return sale;
};

module.exports = { create, list, getById, normalizeItems };
