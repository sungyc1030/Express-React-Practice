const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/testapi');
const loginRouter = require('./routes/login');
const attendanceRouter = require('./routes/attendance');
const classRouter = require('./routes/class');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/', testRouter)
app.use('/api/class', classRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/login', loginRouter);

//Redirect to index if any other request come in. Or maybe error page
app.get('*', (req, res, next) => {
    res.redirect('/'); 
});

module.exports = app;
