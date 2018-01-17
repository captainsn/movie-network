const User = require('../models/schemas/user');
const config = require('../models/config');
const jwt = require('jwt-simple')

exports.getAllPlaylists = (req, res, next) => {
	User.findById(req.params.currentUserId, (err, user) => {
		if (err) return next(err)
    	if (!user) return res.status(404).send('No user with id: ' + req.params.currentUserId)
		return res.json({
                	userId: user.playlists
            	})
	})
}


exports.createPlaylist = (req, res, next) => {
	userId = req.params.currentUserId
	name = req.body.playlistName
	description = req.body.description
	User.findById(userId)
		.then((user) => {
			let newPlaylist = {
				title: name,
				description: description,
				movies: [],
				likes: 0
			}
			user.playlists.push(newPlaylist)
			user.markModified('playlists')
			user.save()
			.then(user => {
            	return res.json({
                	userId: user.playlists
            	})
        	}).catch(next)
		}).catch(next)
}

exports.getPlaylistById = (req, res, next) => {
	userId = req.params.currentUserId
	plId = req.params.playlistId
	//console.log(userId)
	//console.log(plId)
	User.findById(userId)
		.then((user) => {
			playlist = user.playlists.find( function(playlist){
				return playlist._id == plId
			})
			//console.log(JSON.stringify(playlist))
			return res.json({
				pl: playlist
			})
		}).catch(next)
}

exports.addToPlaylist = (req, res, next) => {
	userId = req.params.currentUserId
	plId = req.params.playlistId
	movieId = req.body.movieId
	User.findById(userId)
		.then((user) => {
			playlist = user.playlists.find(function(pl) {return pl.id === plId})
			playlist.movies.push(movieId)
			user.markModified('playlists')
			user.save()
			.then(user => {
            	return res.json({
                	userId: user.playlists
            	})
        	}).catch(next)
		}).catch(next)
	}

/*
* C.R.U.D. routes
*/
exports.createUser = (req, res, next) => {

    const userData = {};
    // validate email
    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }

    // check if password was provided
    if (req.body.name)
    	userData.name = req.body.name;
    if (req.body.password)
        userData.hash = req.body.password;
    if (req.body.hash)
        userData.hash = req.body.hash;

    if (req.body.username)
        userData.username = req.body.username
    // create new user
    const newUser = new User(userData);
    newUser.save()
    .then(user => {
        if (!user) return res.status(500).send('User failed to create')

        let payload = {
            id: user._id,
            email: user.email
        }
        let token = jwt.encode(payload, config.token_secret);
        user.token = token;
        user.save()
        .then(user => {
            if (!user) return res.status(500).send('User failed to create')
            return res.json({
                userId: user._id,
                token: user.token
            })
        })
    }).catch(err => {
        if (err) {
            if (err.code === 11000)
                return res.status(400).send('Email already registered');
            return res.status(400).send(err.message);
        }
    });
};

exports.getAllUsers = (req, res, next) => {
    User.find({}).then(users => res.json(users)).catch(next);
}

exports.getUserById = (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('No user with id: ' + req.params.currentUserId)
    return res.json(user)    
  })
};

exports.updateUser = (req, res, next) => {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {}, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('Could not find user: ' + req.params.currentUserId)
    return res.sendStatus(200)
  })
};

exports.deleteUser = (req, res, next) => {
    User.findByIdAndRemove(req.params.userId, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('Could not find user ' + req.params.currentUserId)
    return res.json(user)
  })
}

exports.followUser = (req, res, next) => {
    let currentUser = ''
    let followedUser = ''
    const userPromises = [
        User.findById(req.params.currentUserId)
        .then((user) => {
            currentUser = user
        }).catch(next),
        User.findById(req.body.userId)
        .then((user) => {
            followedUser = user
        }).catch(next)
    ]
    Promise.all(userPromises)
    .then((users) => {
        if (currentUser.following.includes(String(followedUser._id))) {
            return res.status(400).send('User already followed!')
        }
        console.log(currentUser.following.includes(followedUser._id))
        console.log(currentUser.following)
        currentUser.following.push(followedUser._id)
        currentUser.markModified('following')
        currentUser.save()
        return res.sendStatus(200)
    }).catch(next)
}
