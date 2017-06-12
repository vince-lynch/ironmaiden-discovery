
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true},
  spotify_access_token: { type: String}

}, schemaOptions);


var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
