const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-errors');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({}).select('-__v')
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, about, avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      name, email, password: hash, about, avatar,
    })
      .then((user) => User.findById(user._id).select('-__v')).then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new ConflictError('Данный email уже используется');
        }
        if (err.name === 'ValidationError' || 'SyntaxError') {
          throw new BadRequestError('В запросе переданы некорректные данные');
        }
      })
      .catch(next);
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ _id: user._id });
    })
    .catch(next);
};
