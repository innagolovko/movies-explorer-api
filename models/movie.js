const mongoose = require('mongoose');

// const urlRegex = require('../utils/validation');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // строка
    required: [true, 'Поле должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  duration: {
    type: Number, // число
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) { // validator - функция проверки данных. url - https
        // return urlRegex.test(url);
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Введите URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        // return urlRegex.test(url);
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Введите URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        // return urlRegex.test(url);
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
