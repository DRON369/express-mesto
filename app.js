const express = require('express');
const { connect } = require('mongoose');
const { json, urlencoded } = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
