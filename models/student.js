const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentName : {
    type : String,
    required : true,
    trim : true
  },
  studentRollNum : {
    type : String,
    required : true,
    unique : true
  }

});

module.exports = mongoose.model('Student',studentSchema);
