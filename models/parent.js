const mongoose = require('mongoose');
const validator = require('validator');

const parentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },



});

module.exports = mongoose.model('Parent',parentSchema);
