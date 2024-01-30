require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');
const { MONGO_DB } = require('./utils/config');

const { PORT = 3000, DB_URL = MONGO_DB } = process.env;

const app = express();

app.use(cors());

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(helmet());

// подключаем логгер запросов
app.use(requestLogger);

// подключаем rate-limiter
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', require('./routes/index'));

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

app.use(errorHandler);

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

app.listen(PORT);
