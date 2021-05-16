const validator = require('validator');
const BadRequestError = require('../errors/bad-request-error');

module.exports.emailValidator = (req, res, next) => {
  const { email } = req.body;
  if (validator.isEmail(email)) {
    return next();
  }
  if (!email || !validator.isEmail(email)) {
    const error = new BadRequestError('В запросе переданы некорректные данные');
    return next(error);
  }
  return next('Ошибка валидации');
};
