const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User
    .find({}).select("-__v")
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

module.exports.getUsersById = (req, res) => {
  const userId = req.params.userId;
  User
    .findById(userId)
    .select("-__v")
    .then((user) => res.send(user))
    .catch((err) => {
      err.name === "CastError"
        ? res
            .status(404)
            .send({ message: `Пользователь с id ${userId} не найден!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => {
      return User.findById(user._id).select("-__v");
      }).then((user) => {
        res.send(user);
      })
    .catch((err) => {
      err.name === "ValidationError" || "SyntaxError"
        ? res
            .status(400)
            .send({ message: `В запросе переданы некорректные данные` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) =>
      err.name === "CastError"
        ? res
            .status(404)
            .send({ message: `Пользователь с id ${userId} не найден!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }).select("-__v")
    .then((user) => res.send(user))
    .catch((err) =>
      err.name === "CastError"
        ? res
            .status(404)
            .send({ message: `Пользователь с id ${userId} не найден!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};
