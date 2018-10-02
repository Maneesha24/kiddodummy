const { School } = require("../models/school.js");
const { authenticate } = require("../middlewares/authenticate.js");

module.exports = app => {
  app.get("/dashboard", authenticate, (req, res) => {
    res.send("This is dashboard!!");
  });

  app.get("/", (req, res) => {
    res.send("Welcome to the app");
  });

  app.post("/school/register", (req, res) => {
    const { body } = req;
    const { email, name, mobile, studentsNum, website,password } = body;

    const school = new School(body);
    school
      .save()
      .then(() => {
        return school.generateAuthToken();
      })
      .then(token => {
        res.header("x-auth", token).send(school);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

  app.post("/school/login", (req, res) => {
    const { body } = req;
    School.findByCredentials(body.email, body.password)
      .then(school => {
        return school.generateAuthToken().then(token => {
          res.header("x-auth", token).send(school);
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  app.delete('/school/me/token',authenticate,(req,res)=>{
    req.school.removeToken(req.token).then(()=>{
      res.status(200).send()
    },()=>{
      res.status(400).send()
    });
  });
};





//
//
//
//
//
//
//
// {
// "email" : "venigallamaneesha24@gmail.com",
// "name" : "Maneesha",
// "mobile" : "9398231139",
// "password" : "password",
// "studentsNum" : "50",
// "website" : "www.venigallamaneesha.com"
//
//
// }
