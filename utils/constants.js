// Сообщения об ошибках
const HTTP_STATUS_BAD_REQUEST = 'Некорректный запрос серверу'; // 400
const HTTP_STATUS_UNAUTHORIZED = 'Неавторизованный'; // 401
const HTTP_STATUS_FORBIDDEN = 'Доступ запрещён'; // 403
const HTTP_STATUS_NOT_FOUND = 'Не найден'; // 404
const HTTP_STATUS_CONFLICT = 'Конфликт данных при выполнении запроса клиента'; // 409
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 'На сервере произошла ошибка'; // 500

module.exports = {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
};
