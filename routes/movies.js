const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { validationCreateMovies, validationDeleteMovies } = require('../utils/validation');

router.get('/', getMovies);

router.post('/', validationCreateMovies, createMovie);

router.delete('/:movieId', validationDeleteMovies, deleteMovie);

module.exports = router;
