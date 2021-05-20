const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');

module.exports.checkEmailUnique = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      throw new ConflictError('Данный email уже используется');
    }
    next();
  })
    .catch(next);
};
