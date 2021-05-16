const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.headers;

  if (!authorization || !authorization.cookie) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log(payload);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};
