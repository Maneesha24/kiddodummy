const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("../config/keys.js");
const classRoomSchema = require('./room.js');

const schoolSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: value => {
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "{VALUE} is not a valid mobile number"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  studentsNum: {
    type: Number,
    minlength: 1
  },
  website: {
    type: String,
    trim: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

schoolSchema.statics.findByCredentials = function(email,password) {
  const School = this;
  return School.findOne({email}).then((school)=>{
    if(!school){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,school.password,(err,res)=>{
        if(res){
          resolve(school);
        }else{
          reject();
        }
      })
    })
  })

}

schoolSchema.methods.removeToken = function(token){
  var school = this;
  return school.update({
    $pull : {
      tokens : {
        token
      }
    }
  });
}

schoolSchema.methods.generateAuthToken = function() {
  var school = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: school._id.toHexString(), access }, keys.cookieKey)
    .toString();

  school.tokens.push({ access, token });
  return school.save().then(() => {
    return token;
  });
};

schoolSchema.methods.toJSON = function() {
  const school = this;
  const schoolObj = school.toObject();
  return _.pick(schoolObj, ["_id", "email"]);
};

schoolSchema.statics.findByToken = function(token){
  const School = this;
  let decoded;
  try{
    decoded  = jwt.verify(token,keys.cookieKey);
  }catch(e){
    return Promise.reject();
  }
  return School.findOne({
    "_id" : decoded._id,
    "tokens.token" : token,
    "tokens.access" : 'auth'
  });
}

schoolSchema.pre("save", function(next) {
  var school = this;
  if (school.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(school.password, salt, (err, hash) => {
        school.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const School = mongoose.model("School", schoolSchema);
module.exports = {School}
