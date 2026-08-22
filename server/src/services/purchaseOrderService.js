const Product = require('../models/Product');
const PurchaseOrder = require('../models/PurchaseOrder');

const notFound = () => {
  const error = new Error('Purchase order not found');
  error.statusCode = 404;
  return error;
};

const list = () => PurchaseOrder.find()
  .populate('supplier', 'name email phone')
  .populate('items.product', 'sku name price')
  .sort({ createdAt: -1 });

const getById = async (id) => {
  const order = await PurchaseOrder.findById(id)
    .populate('supplier', 'name email phone')
    .populate('items.product', 'sku name price');
  if (!order) throw notFound();
  return order;
};

const create = (data) => PurchaseOrder.create(data);

const update = async (id, data) => {
  const order = await PurchaseOrder.findOneAndUpdate(
    { _id: id, status: { $ne: 'Received' } },
    data,
    { returnDocument: 'after', runValidators: true }
  );
  if (!order) throw notFound();
  return order;
};

const remove = async (id) => {
  const order = await PurchaseOrder.findOneAndDelete({ _id: id, status: { $ne: 'Received' } });
  if (!order) throw notFound();
  return order;
};

const receive = async (id) => {
  const order = await PurchaseOrder.findOneAndUpdate(
    { _id: id, status: { $in: ['Draft', 'Ordered'] } },
    { $set: { status: 'Received' } },
    { returnDocument: 'after' }
  );
  if (!order) throw notFound();

  await Promise.all(order.items.map((item) => (
    Product.updateOne(
      { _id: item.product },
      { $inc: { quantityInStock: item.quantity } }
    )
  )));
  return getById(id);
};

module.exports = { list, getById, create, update, remove, receive };
