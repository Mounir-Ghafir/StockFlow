const purchaseOrderService = require('../services/purchaseOrderService');

const list = async (req, res, next) => {
  try {
    return res.json({ data: await purchaseOrderService.list() });
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    return res.json({ data: await purchaseOrderService.getById(req.params.id) });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    return res.status(201).json({ data: await purchaseOrderService.create(req.body) });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    return res.json({ data: await purchaseOrderService.update(req.params.id, req.body) });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await purchaseOrderService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const receive = async (req, res, next) => {
  try {
    return res.json({ data: await purchaseOrderService.receive(req.params.id) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { list, getById, create, update, remove, receive };
