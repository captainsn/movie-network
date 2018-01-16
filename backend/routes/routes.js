'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth')
const users = require('../controllers/users')
const movies = require('../controllers/movies')



/*
* User Routes
*/
router.route('/users')
  .post(users.createUser)
  /*.get(auth.validateUser, users.getUserById)*/
  .get(users.getAllUsers)
  
router.route('/users/:userId/id')
  .get(users.getUserById)
  .put(users.updateUser)
  .delete(users.deleteUser)

/*
* Movie Routes
*/
router.route('/movies')
  .get(movies.getAllMovies)
  .post(movies.createMovie)

router.route('/movies/:movieId/id')
  .get(movies.getMovieById)
  .put(movies.updateMovie)
  .delete(movies.deleteMovie)
  
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