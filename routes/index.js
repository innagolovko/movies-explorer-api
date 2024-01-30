const router = require('express').Router();
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

// авторизация
router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Что-то пошло не так :('));
});

module.exports = router;
