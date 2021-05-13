const express = require('express');
const helmet = require('helmet'); // Защита приложения от web-уязвимостей путём настройки заголовков http
const { connect } = require('mongoose');
const { json, urlencoded } = require('body-parser');
const { login, createUser } = require('./controllers/users');
const { emailValidator } = require('./middlewares/emailValidator');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet()); // Защита приложения от web-уязвимостей путём настройки заголовков http
app.use(json());
app.use(urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', emailValidator, createUser);

// подключаемся к серверу mongo
connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//! Хардкод. Переделать в следующем проекте
app.use((req, res, next) => {
  req.user = {
    _id: '608473fa5bf4ec3208386946',
  };

  next();
});
//! =======================================

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
