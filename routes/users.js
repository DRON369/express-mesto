const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUsersById, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', auth, getUsersById);
router.get('/:userId', getUsersById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
