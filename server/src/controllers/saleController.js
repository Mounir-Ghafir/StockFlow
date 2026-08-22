const saleService = require('../services/saleService');

const create = async (req, res, next) => {
  try {
    const sale = await saleService.create(req.user._id, req.body.items);
    return res.status(201).json({ data: sale });
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    return res.json({ data: await saleService.list(req.user) });
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    return res.json({ data: await saleService.getById(req.params.id, req.user) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { create, list, getById };
