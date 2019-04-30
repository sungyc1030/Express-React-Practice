const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const passport = require('passport');
const { Model } = require('objection');
const Knex = require('knex');

const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const configRouter = require('./routes/config');
const attendanceRouter = require('./routes/attendance');
const classRouter = require('./routes/class');

var app = express();

require('./scripts/passportSetup');

const knex = Knex({
    client: 'mysql',
    useNullAsDefault: true,
    connection: {
        host: 'localhost',
        user: 'test',
        password: '12345678',
        database: '테스트'
    }
});

Model.knex(knex);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/user', userRouter);
app.use('/api/class', classRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/login', loginRouter);
app.use('/api/config', configRouter);

//Redirect to index if any other request come in. Or maybe error page
app.get('*', (req, res, next) => {
    res.redirect('/'); 
});

module.exports = app;
