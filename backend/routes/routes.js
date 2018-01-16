'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth')
const users = require('../controllers/users')


/*
* User Routes
*/
router.route('/users')
  .post(users.createUser)
<<<<<<< HEAD
=======
  /*.get(auth.validateUser, users.getUserById)*/
>>>>>>> 42f5ae12b14e73d1b59ddeb116a2ff3541c03da9
  .get(users.getAllUsers)
  .put(auth.validateUser, users.updateUser)
  .delete(auth.validateUser, users.deleteUser)

/*
* Auth Routes
*/
router.route('/auth/login')
  .post(auth.loginUser);

// expose routes through router object
module.exports = router;
