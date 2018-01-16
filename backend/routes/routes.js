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
  /*.get(auth.validateUser, users.getUserById)*/
  .get(users.getAllUsers)
  .put(auth.validateUser, users.updateUser)
  .delete(auth.validateUser, users.deleteUser)

/*
* Auth Routes
*/
router.route('/auth/login')
  .post(auth.loginUser);

/*
* Following Users
*/
router.route('/users/follow')
	.post(users.followUser)

// expose routes through router object
module.exports = router;
