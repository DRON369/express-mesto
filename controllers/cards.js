const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-errors');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .select('-__v')
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError' || 'SyntaxError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (req.user._id !== cardId) {
    res.status(403).send({ message: 'Нельзя удалять чужие карточки!' });
  }
  Card.findByIdAndDelete(cardId).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
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

module.exports.likeCard = (req, res, next) => {
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
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.unlikeCard = (req, res, next) => {
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
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('В запросе переданы некорректные данные');
      }
    })
    .catch(next);
};
