const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const signupSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    match: /^\+256[0-9]{9}$/
  },
});

signupSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model('Signup', signupSchema);