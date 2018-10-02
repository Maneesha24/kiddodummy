const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("../config/keys.js");

const classRoomSchema = new mongoose.Schema({
  teacherEmail: {
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
  teacherName: {
    type: String,
    required: true,
    minlength: 1
  },
  teacherMobile: {
    type: String,
    required: true,
    validate: {
      validator: value => {
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "{VALUE} is not a valid mobile number"
    }
  },
  teacherPassword: {
    type: String,
    required: true,
    minlength: 8
  },
  teacherRoom: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  resetPasswordToken: {
    type : String
  },
  resetPasswordExpires: {
    type : Date
  },
  teacherTokens: [
    {
      teacherAccess: {
        type: String,
        required: true
      },
      teacherToken: {
        type: String,
        required: true
      }
    }
  ]
});

classRoomSchema.statics.findByCredentials = function(
  teacherEmail,
  teacherPassword
) {
  const ClassRoom = this;
  return ClassRoom.findOne({ teacherEmail }).then(classRoom => {
    if (!classRoom) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(teacherPassword, classRoom.teacherPassword, (err, res) => {
        if (res) {
          resolve(classRoom);
        } else {
          reject();
        }
      });
    });
  });
};

classRoomSchema.methods.removeToken = function(teacherToken) {
  var classRoom = this;
  return classRoom.update({
    $pull: {
      teacherTokens: {
        teacherToken
      }
    }
  });
};

classRoomSchema.methods.generateAuthToken = function() {
  var classRoom = this;
  var teacherAccess = "auth";
  var teacherToken = jwt
    .sign({ _id: classRoom._id.toHexString(), teacherAccess }, keys.teacherKey)
    .toString();

  classRoom.teacherTokens.push({ teacherAccess, teacherToken });
  return classRoom.save().then(() => {
    return teacherToken;
  });
};

classRoomSchema.methods.toJSON = function() {
  const classRoom = this;
  const classRoomObj = classRoom.toObject();
  return _.pick(classRoomObj, ["_id", "teacherEmail"]);
};

classRoomSchema.statics.findByToken = function(teacherToken) {
  const ClassRoom = this;
  let decoded;
  try {
    decoded = jwt.verify(teacherToken, keys.teacherKey);
  } catch (e) {
    return Promise.reject();
  }
  return ClassRoom.findOne({
    _id: decoded._id,
    "teacherTokens.teacherToken": teacherToken,
    "teacherTokens.teacherAccess": "auth"
  });
};

classRoomSchema.pre("save", function(next) {
  var classRoom = this;
  if (classRoom.isModified("teacherPassword")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(classRoom.teacherPassword, salt, (err, hash) => {
        classRoom.teacherPassword = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const ClassRoom = mongoose.model("ClassRoom", classRoomSchema);
module.exports = { ClassRoom };
