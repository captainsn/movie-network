const Movie = require('../models/schemas/movie');
const config = require('../models/config');
const jwt = require('jwt-simple')

/*
* C.R.U.D. routes
*/
exports.createMovie = (req, res, next) => {
	if (!req.body.title) {
		return res.status(400).send('Must provide title')
	}
	if (!req.body.genre) {
		return res.status(400).send('Must provide genre')
	}
	if (!req.body.trailer) {
		return res.status(400).send('Must provide trailer')
	}
	if (!req.body.link) {
		return res.status(400).send('Must provide link')
	}

	const movieData = {
		title: req.body.title,
		genre: req.body.genre,
		trailer: req.body.trailer,
		link: req.body.link
	}

	const newMovie = new Movie(movieData)
	newMovie.save((err) => {
		if (err) return next(err)
		return res.json(newMovie)
	})
}

exports.getAllMovies = (req, res, next) => {
	Movie.find({}, (err, movies) => {
		if (err) return next(err)
		return res.json(movies)
	})
}

exports.getMovieById = (req, res, next) => {
	Movie.findById(req.params.movieId, (err, movie) => {
		if (err) return next(err)
		if (!movie) return res.status(404).send('No movie with id: ' + req.params.movieId)
		return res.json(movie)
	})
}

exports.updateMovie = (req, res, next) => {
	Movie.findOneAndUpdate({ _id: req.params.movieId }, req.body, {}, (err, movie) => {
		if (err) return next(err)
		if (!movie) return res.status(404).send('No movie with id: ' + req.params.movieId)
		return res.sendStatus(200)
	})
}

exports.deleteMovie = (req, res, next) => {
	Movie.findByIdAndRemove(req.params.movieId, (err, movie) => {
		if (err) return next(err)
		if (!movie) return res.status(404).send('Could not find movie ' + req.params.movieId)
		return res.json(movie)
	})
}