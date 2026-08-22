const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message),
      },
    });
  }

  if (source === 'query') {
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, value);
  } else {
    req.body = value;
  }
  return next();
};

module.exports = validate;
