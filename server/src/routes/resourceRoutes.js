const express = require('express');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');
const validate = require('../middleware/validate');

const createResourceRouter = ({ controller, schema, querySchema }) => {
  const router = express.Router();
  router.use(authenticate);
  router.get('/', querySchema ? validate(querySchema, 'query') : (req, res, next) => next(), controller.list);
  router.get('/:id', controller.getById);
  router.post('/', requireRole('Admin'), validate(schema), controller.create);
  router.put('/:id', requireRole('Admin'), validate(schema), controller.update);
  router.delete('/:id', requireRole('Admin'), controller.remove);
  return router;
};

module.exports = createResourceRouter;
