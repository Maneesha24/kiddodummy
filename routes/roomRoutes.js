const { ClassRoom } = require("../models/room.js");
const flash = require("express-flash");
const { authenticate } = require("../middlewares/authenticate.js");
const { teacherLogin } = require("../middlewares/teacherLogin.js");
const crypto = require('crypto');
const async = require("async");

module.exports = app => {
  app.post("/teacher/register", authenticate, (req, res) => {
    const { body } = req;
    const {
      teacherEmail,
      teacherName,
      teacherMobile,
      teacherRoom,
      teacherPassword
    } = body;

    const classRoom = new ClassRoom(body);
    classRoom
      .save()
      .then(() => {
        return classRoom.generateAuthToken();
      })
      .then(teacherToken => {
        res.header("x-auth", teacherToken).send(classRoom);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

  app.post("/teacher/login", (req, res) => {
    const { body } = req;
    ClassRoom.findByCredentials(body.teacherEmail, body.teacherPassword)
      .then(classRoom => {
        return classRoom.generateAuthToken().then(teacherToken => {
          res.header("x-auth", teacherToken).send(classRoom);
        });
      })
      .catch(e => {
        res.status(400).send();
      });
  });

  app.delete("/teacher/me/teacherToken", teacherLogin, (req, res) => {
    req.classRoom.removeToken(req.teacherToken).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      }
    );
  });

  app.post("/teacher/forgot", (req, res) => {
    async.waterfall(
      [
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            const token = buf.toString("hex");
            done(err, token);
          });
        },
        function(token, done) {
          ClassRoom.findOne({ teacherEmail: req.body.teacherEmail }, function(
            err,
            classRoom
          ) {
            if (!classRoom) {
              return res.redirect("/forgot");
            }
            classRoom.resetPasswordToken = token;
            classRoom.resetPasswordExpires = Date.now() + 3600000;
            classRoom.save(function(err) {
              done(err, token, classRoom);
            });
          });
        },
        function(token, classRoom, done) {
          var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "SendGrid",
            auth: {
              user: "!!! YOUR SENDGRID USERNAME !!!",
              pass: "!!! YOUR SENDGRID PASSWORD !!!"
            }
          });
          var mailOptions = {
            to: classRoom.teacherEmail,
            from: "passwordreset@kiddo.com",
            subject: "Kiddo password reset request",
            text:
              "You are receiving this because you have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://" +
              req.headers.host +
              "/reset/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n"
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash(
              "info",
              "An e-mail has been sent to " +
                classRoom.teacherEmail +
                " with further instructions."
            );
            done(err, "done");
          });
        }
      ],
      function(err) {
        if (err) return next(err);
        res.redirect("/forgot");
      }
    );
  });
};
