const mysql = require('mysql')
const async = require('async')

var state = {pool: null, mode: null}

exports.connect = function(done){
    state.pool = mysql.createPool({
        connectionLimit : 40,
        host: 'localhost',
        user: 'sy',
        password: 'password',
        database: '테스트'
    })

    state.mode = mode
    done()
}

exports.get = function(){
    return state.pool
}

exports.getConnection = function(err, done){

}

exports.testInsert = function(data, done){
    var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))

    var names = Object.keys(data.tables)
    async.each(names, function(name, cb){
        async.each(data.tables[name], function(row, cb){
            var keys = Object.keys(row)
            var values = keys.map(function(key) {return "'" + row[key] + "'"})

            pool.query('INSERT INTO ' + name + '(' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
        }, cb)
    }, done)
}

exports.drop = function(tables, done){
    var pool = state.pool
    if(!pool) return done(new Error('Missing database connection'))

    async.each(tables, function(name, cb){
        pool.query('DELETE * FROM ' + name, cb)
    }, done)
}

