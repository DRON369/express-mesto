const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .select('-__v')
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => Card.findById(card._id).select('-__v'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      (err.name === 'ValidationError' || 'SyntaxError')
        ? res
          .status(400)
          .send({ message: `В запросе переданы некорректные данные ${err}` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Карточка с id ${cardId} не найдена!` });
        return;
      }
      err.name === 'CastError'
        ? res
          .status(400)
          .send({ message: 'В запросе переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .select('-__v')
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Карточка с id ${req.params.cardId} не найдена!` });
        return;
      }
      err.name === 'CastError'
        ? res
          .status(400)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .select('-__v')
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: `Карточка с id ${req.params.cardId} не найдена!` });
        return;
      }
      err.name === 'CastError'
        ? res
          .status(400)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};
