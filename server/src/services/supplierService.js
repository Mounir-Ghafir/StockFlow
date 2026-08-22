const Supplier = require('../models/Supplier');

const notFound = () => {
  const error = new Error('Supplier not found');
  error.statusCode = 404;
  return error;
};

const list = () => Supplier.find().sort({ name: 1 });
const getById = async (id) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) throw notFound();
  return supplier;
};
const create = (data) => Supplier.create(data);
const update = async (id, data) => {
  const supplier = await Supplier.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!supplier) throw notFound();
  return supplier;
};
const remove = async (id) => {
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier) throw notFound();
  return supplier;
};

module.exports = { list, getById, create, update, remove };
