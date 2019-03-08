const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/testapi')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
//app.use('/api/users', usersRouter);
app.use('/', testRouter)

//Redirect to index if any other request come in. Or maybe error page
app.get('*', (req, res, next) => {
    res.redirect('/'); 
});

module.exports = app;
