const { School } = require("../models/school.js");

const authenticate = (req, res, next) => {
  const token = req.header("x-auth");
  School.findByToken(token)
    .then(school => {
      if (!school) {
        return Promise.reject();
      }
      req.school = school;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
