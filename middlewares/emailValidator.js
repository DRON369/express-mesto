const validator = require('validator');

module.exports.emailValidator = (req, res, next) => {
  const { email } = req.body;
  if (validator.isEmail(email)) {
    return next();
  }
  return res.status(400).send({ message: 'В запросе переданы некорректные данные' });
};
