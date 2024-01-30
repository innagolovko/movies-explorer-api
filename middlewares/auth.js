const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'mesto-test' } = process.env;
const UnautorizedError = require('../errors/UnautorizedError');

// console.log(SECRET_KEY);

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация.');
  }
  const token = authorization.replace('Bearer ', '');
  // const token = req.headers.authorization;
  let payload;
  try { // попытаемся верифицировать токен
    // payload = jwt.verify(token, SECRET_KEY);
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret');
  } catch (error) { // отправим ошибку, если не получилось
    throw new UnautorizedError('Необходима авторизация.');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
