const express = require('express');
const helmet = require('helmet'); // Защита приложения от web-уязвимостей путём настройки заголовков http
const { connect } = require('mongoose');
const { json, urlencoded } = require('body-parser');
const { Joi, celebrate, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { emailValidator } = require('./middlewares/emailValidator');
const auth = require('./middlewares/auth');
const { checkEmailUnique } = require('./middlewares/checkEmailUnique');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet()); // Защита приложения от web-уязвимостей путём настройки заголовков http
app.use(json());
app.use(urlencoded({ extended: true }));
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(5),
    }),
  }),
  login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    about: Joi.string(),
    avatar: Joi.string(),
  }),
}), emailValidator, checkEmailUnique, createUser);

// подключаемся к серверу mongo
connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
