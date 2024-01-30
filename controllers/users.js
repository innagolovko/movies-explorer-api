const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { SECRET_KEY } = require('../utils/config');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.status(HTTP_STATUS_CREATED).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
        } else if (error instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(error.message));
        } else {
          next(error);
        }
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
      // токен будет просрочен через семь дней после создания

      // вернём токен
      res.send({ token });
    })
    .catch((error) => {
      // console.log(error)
      next(error);
    });
};

/* module.exports.getUser = (req, res, next) => {
  // const { _id: userId } = req.user;
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};  */

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден.'));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(error);
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};
