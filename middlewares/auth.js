const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const authorization = req.headers;
  if (!authorization || !authorization.cookie) {
    const error = new UnathorizedError('Необходима авторизация');
    return next(error);
  }

  const token = authorization.cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (!payload) {
      const error = new UnathorizedError('Необходима авторизация');
      return next(error);
    }
    return next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};
