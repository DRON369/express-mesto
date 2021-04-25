import {
  find, findById, create, findByIdAndUpdate,
} from '../models/user';

export function getUsers(req, res) {
  find({}).select('-__v')
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
}

export function getUsersById(req, res) {
  const { userId } = req.params;
  findById(userId)
    .select('-__v')
    .then((user) => res.send(user))
    .catch((err) => {
      err.name === 'CastError'
        ? res
          .status(404)
          .send({ message: `Пользователь с id ${userId} не найден!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
}

export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  create({ name, about, avatar })
    .then((user) => findById(user._id).select('-__v')).then((user) => {
      res.send(user);
    })
    .catch((err) => {
      (err.name === 'ValidationError' || 'SyntaxError')
        ? res
          .status(400)
          .send({ message: 'В запросе переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
}

export function updateUser(req, res) {
  const { name, about, avatar } = req.body;
  findByIdAndUpdate(req.user._id, { name, about, avatar }).select('-__v')
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError'
      ? res
        .status(404)
        .send({ message: `Пользователь с id ${req.user._id} не найден!` })
      : res.status(500).send({ message: `Произошла ошибка: ${err}` })));
}

export function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  findByIdAndUpdate(req.user._id, { avatar }).select('-__v')
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError'
      ? res
        .status(404)
        .send({ message: `Пользователь с id ${req.user._id} не найден!` })
      : res.status(500).send({ message: `Произошла ошибка: ${err}` })));
}
