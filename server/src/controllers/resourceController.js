const makeController = (service) => ({
  list: async (req, res, next) => {
    try {
      const result = await service.list(req.query);
      return res.json(Array.isArray(result) ? { data: result } : result);
    } catch (error) {
      return next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      return res.json({ data: await service.getById(req.params.id) });
    } catch (error) {
      return next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      return res.status(201).json({ data: await service.create(req.body) });
    } catch (error) {
      return next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      return res.json({ data: await service.update(req.params.id, req.body) });
    } catch (error) {
      return next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
});

module.exports = makeController;
