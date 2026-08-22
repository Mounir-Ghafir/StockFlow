const dashboardService = require('../services/dashboardService');

const summary = async (req, res, next) => {
  try {
    return res.json({ data: await dashboardService.getSummary() });
  } catch (error) {
    return next(error);
  }
};

module.exports = { summary };
