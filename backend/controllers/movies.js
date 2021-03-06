const Movie = require('../models/schemas/movie');
const config = require('../models/config');
const jwt = require('jwt-simple')
const request = require('request')
const imdb = require('name-to-imdb')
const key = "4948150e13c1a8f29e95504275e92dda"
const select = require('soupselect').select

var htmlparser = require("htmlparser")

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

//Need to get promises to work
exports.makeMovieByImdb = (req, res, next) => {

	let temp = { title: req.body.title, trailer: "null"}

	imdb({ name: temp.title }, function(err, res2, inf) {
		if (err) return next(err)
		const code = res2
		temp.link = "http://www.imdb.com/title/" + code
		request.get({
			url: 'https://api.themoviedb.org/3/movie/' + code + "?api_key=" + key + "&language=en-US"
		}, (err, response, movie) => {
			if (err) return next(err)
			request(temp.link, (err, response, body) => {
				let handler = new htmlparser.DefaultHandler(function (error, dom) {
					if (error) return next(error)
				});
				let parser = new htmlparser.Parser(handler);
				parser.parseComplete(body);

				let poster = select(handler.dom, 'div.poster')
				let link = select(poster, 'img')[0].attribs.src + ''
				temp.poster = link
				console.log(temp.poster)
				movie = JSON.parse(movie)
				temp.genre = movie.genres[0].name

				const newMovie = new Movie(temp)
				newMovie.save((err) => {
					console.log(temp.poster)
					if (err) return next(err)
					return res.json(newMovie)
				})
			})
		})
	})
}

exports.getMoviePoster = (req, res, next) => {
	Movie.findById(req.params.movieId, (err, movie) => {
		if (err) return next(err)
		if (!movie) return res.status(404).send('No movie with id: ' + req.params.movieId)
		return res.json(movie.poster)
	})
}

exports.getAllPosters = (req, res, next) => {
	Movie.find({}, (err, movies) => {
		if (err) return next(err)
		const temp = movies.map(movie => {
			let obj = {}
			obj.poster = movie.poster
			obj.id = movie._id
			return obj
		})
		return res.json(temp)
	})
}