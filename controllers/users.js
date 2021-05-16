const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).select('-__v')
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.getUsersById = (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с id ${userId} не найден!` });
        return;
      }
      err.name === 'CastError'
        ? res
          .status(400)
          .send({ message: 'В запросе переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
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
        (err.name === 'ValidationError' || 'SyntaxError')
          ? res
            .status(400)
            .send({ message: 'В запросе переданы некорректные данные' })
          : res.status(500).send({ message: `Произошла ошибка: ${err}` });
      });
  });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с id ${req.user._id} не найден!` });
        return;
      }
      err.name === 'CastError' || 'ValidationError'
        ? res
          .status(400)
          .send({ message: 'В запросе переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователь с id ${req.user._id} не найден!` });
        return;
      }
      err.name === 'CastError' || 'ValidationError'
        ? res
          .status(400)
          .send({ message: 'В запросе переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
