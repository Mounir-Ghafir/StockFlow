const Category = require('../models/Category');

const notFound = () => {
  const error = new Error('Category not found');
  error.statusCode = 404;
  return error;
};

const list = () => Category.find().sort({ name: 1 });
const getById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw notFound();
  return category;
};
const create = (data) => Category.create(data);
const update = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw notFound();
  return category;
};
const remove = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw notFound();
  return category;
};

module.exports = { list, getById, create, update, remove };
