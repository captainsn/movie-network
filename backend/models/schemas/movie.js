const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var movieSchema = new Schema({
    title: String,
    genre: String,
    trailer: String,
    link: String
  },
  {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    },
  }
);

movieSchema.pre('save', function(callback) {
    if (!this.title)
        return callback(new Error('Missing title'));
    if (!this.genre)
        return callback(new Error('Missing genre'));
    if (!this.trailer)
        return callback(new Error('Missing trailer'));
    if (!this.link)
        return callback(new Error('Missing link'));

    callback();
});

var Movie= mongoose.model('Movie', movieSchema);

module.exports = User;
