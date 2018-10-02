const { ClassRoom } = require("../models/room.js");

const teacherLogin = (req, res, next) => {
  const teacherToken = req.header("x-auth");
  ClassRoom.findByToken(teacherToken)
    .then(classRoom => {
      if (!classRoom) {
        return Promise.reject();
      }
      req.classRoom = classRoom;
      req.teacherToken = teacherToken;
      next();
    })
    .catch(e => {
      res.status(401).send();
    });
};

module.exports = { teacherLogin };
