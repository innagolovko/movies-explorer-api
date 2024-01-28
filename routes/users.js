const router = require('express').Router();
const {
  getUser, editUserData,
} = require('../controllers/users');
const { validationEditUserData } = require('../utils/validation');

router.get('/me', getUser);
router.patch('/me', validationEditUserData, editUserData);

module.exports = router;
