const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnautorizedError = require('../errors/UnautorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля два символа.'],
    maxlength: [30, 'Максимальная длина поля тридцать символов.'],
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено.'],
    unique: true, // для аутентификации email должен быть уникальным
    validate: {
      validator(email) {
        return /^\S+@\S+\.\S+$/.test(email); // https://uibakery.io/regex-library/email-regex-csharp
      },
      message: 'Введите email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено.'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnautorizedError('Неправильные почта или пароль');
        // return Promise.reject(new UnautorizedError('Неправильные почта или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizedError('Неправильные почта или пароль');
            // return Promise.reject(new UnautorizedError('Неправильные почта или пароль.'));
          }
          return user; // теперь user доступен
        });
    });
};

// Создаём модель и экспортируем её. Метод mongoose.model имеет два аргумента
module.exports = mongoose.model('user', userSchema);
