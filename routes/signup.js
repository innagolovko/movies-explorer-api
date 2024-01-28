const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { validationCreateUser } = require('../utils/validation');

router.post('/', validationCreateUser, createUser);

module.exports = router;
