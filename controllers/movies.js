const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  // Movie.find({}) - пустой объект метода вернёт все карточки
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, // страна создания фильма (поле-строка)
    director, // режиссёр фильма (поле-строка)
    duration, // длительность фильма (поле-число)
    year, // год выпуска фильма (поле-строка)
    description, // описание фильма (поле-строка)
    image, // ссылка на постер к фильму (поле-строка). Записать URL-адресом
    trailerLink, // ссылка на трейлер фильма (поле-строка). Записать URL-адресом
    thumbnail, // миниатюрное изображение постера к фильму (поле-строка). Записать URL-адресом
    movieId, // id фильма, который содержится в ответе сервиса MoviesExplorer (формат number)
    nameRU, // название фильма на русском языке (поле-строка)
    nameEN, // название фильма на английском языке (поле-строка)
  } = req.body;
  // создаём карточку
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    // берём карточку
    .then((movie) => {
      // по id карточки делаем поиск
      Movie.findById(movie._id)
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(() => {
          next(new NotFoundError('Не найден.'));
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Не найден.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) return next(new ForbiddenError('Невозможно удалить карточку другого пользователя.'));
      return Movie.findByIdAndDelete(movieId).then(() => res.send({ data: movie }));
    })
    .catch(next);
};
