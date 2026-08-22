const Product = require('../models/Product');
const Sale = require('../models/Sale');

const getSummary = async () => {
  const [stock, lowStockCount, recentSales] = await Promise.all([
    Product.aggregate([
      { $group: { _id: null, value: { $sum: { $multiply: ['$quantityInStock', '$price'] } } } },
    ]),
    Product.countDocuments({ $expr: { $lte: ['$quantityInStock', '$lowStockThreshold'] } }),
    Sale.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  return {
    stockValue: stock[0] ? Number(stock[0].value.toString()) : 0,
    lowStockCount,
    recentSalesTotal: recentSales[0] ? Number(recentSales[0].total.toString()) : 0,
  };
};

module.exports = { getSummary };
