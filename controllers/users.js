const user = require("../models/user");
const router = require("express").Router();

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((user) => res.send({ users: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUsersById = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    res.send({ error: 'Такого пользователя нет' });
    return;
  }
  user.findById(userId)
  .then((user) => res.send({ user: user }))
  .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((user) => res.send({ user: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
