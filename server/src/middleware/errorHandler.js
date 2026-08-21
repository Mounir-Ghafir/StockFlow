const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: { message: 'A record with that value already exists' },
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Database validation failed',
        details: Object.values(error.errors).map((item) => item.message),
      },
    });
  }

  if (!error.statusCode || error.statusCode >= 500) {
    console.error(error);
  }
  return res.status(error.statusCode || 500).json({
    error: { message: error.statusCode ? error.message : 'Internal server error' },
  });
};

module.exports = errorHandler;
