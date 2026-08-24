const Product = require('../models/Product');

const populateProduct = (query) => query.populate('category', 'name').populate('supplier', 'name email phone');

const notFound = () => {
  const error = new Error('Product not found');
  error.statusCode = 404;
  return error;
};

const buildProductFilter = ({ search, category, supplier, lowStock }) => {
  const filter = {};
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { sku: { $regex: search, $options: 'i' } },
  ];
  if (category) filter.category = category;
  if (supplier) filter.supplier = supplier;
  if (lowStock) filter.$expr = { $lte: ['$quantityInStock', '$lowStockThreshold'] };
  return filter;
};

const list = async ({ page, limit, search, category, supplier, lowStock }) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const filter = buildProductFilter({ search, category, supplier, lowStock });

  const skip = (currentPage - 1) * pageLimit;
  const [products, total] = await Promise.all([
    populateProduct(Product.find(filter).sort({ name: 1 }).skip(skip).limit(pageLimit)),
    Product.countDocuments(filter),
  ]);

  return {
    data: products,
    pagination: { page: currentPage, limit: pageLimit, total, pages: Math.ceil(total / pageLimit) },
  };
};

const getById = async (id) => {
  const product = await populateProduct(Product.findById(id));
  if (!product) throw notFound();
  return product;
};
const create = (data) => Product.create(data);
const update = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!product) throw notFound();
  return populateProduct(Product.findById(product._id));
};
const remove = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw notFound();
  return product;
};

module.exports = { list, getById, create, update, remove, buildProductFilter };
