const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');



/*=============================================
=            Routes for users
=============================================*/

router.get('/', (req, res, next) => {
    return res.render('index');
});


router.get('/register', (req, res, next) => {
    return res.render('register');
});

router.get('/login', (req, res, next) => {
    return res.render('login');
});


router.get('/account', (req, res, next) => {
    return res.render('account');
});

router.get('/browse', (req, res, next) => {
    return res.render('browse');
});

/*=============================================
=            Routes for playlists
=============================================*/

router.get('/create', (req, res, next) => {
    return res.render('create');
});


/*=============================================
=            Routes for backend requests
=============================================*/

router.post('/register', (req, res, next) => {
  console.log("made it to register!!!!")
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})

router.post('/login', (req, res, next) => {
  console.log("hellooooooo")
  request.post({
    url: config.apiUrl + '/auth/login',
    form: req.body
  }).pipe(res)
})

module.exports = router;