import {
  find, create, findById, findByIdAndDelete, findByIdAndUpdate,
} from '../models/card';

export function getCards(req, res) {
  find({})
    .select('-__v')
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
}

export function createCard(req, res) {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => findById(card._id).select('-__v'))
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
}

export function deleteCard(req, res) {
  const { cardId } = req.params;
  if (!cardId) {
    res.status(404).send({ message: `Карточка с id ${cardId} не найдена!` });
    return;
  }
  findByIdAndDelete(cardId)
    .select('-__v')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с id ${cardId} не найдена!` });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      err.name === 'CastError'
        ? res
          .status(404)
          .send({ message: `Карточка с id ${cardId} не найдена!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
}

export function likeCard(req, res) {
  findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .select('-__v')
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена!` });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      err.name === 'CastError'
        ? res
          .status(404)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
}

export function unlikeCard(req, res) {
  findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .select('-__v')
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена!` });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      err.name === 'CastError'
        ? res
          .status(404)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена!` })
        : res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
}
