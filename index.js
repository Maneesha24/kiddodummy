const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const keys = require('./config/keys.js');

mongoose.connect(keys.mongoURI,{useNewUrlParser:true});
mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json());
app.use(flash());

require('./routes/appRoutes.js')(app);
require('./routes/roomRoutes.js')(app);
require('./routes/studentRoutes.js')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
