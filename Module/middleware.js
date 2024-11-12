const { validationResult } = require('express-validator');

const inputErrorHandler = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    res.json({ message: error.array() });
  } else {
    next();
  }
};

module.exports = { inputErrorHandler };