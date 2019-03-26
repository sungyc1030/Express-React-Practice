const { Model } = require('objection');
const Knex = require('knex');

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

//var state = {pool: null}

/*exports.connect = function(done){
    state.pool = mysql.createPool({
        connectionLimit : 40,
        host: 'localhost',
        user: 'test',
        password: '12345678',
        database: '테스트'
    })

    //done()
}

exports.checkConnection = function(){
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'test',
        password: '12345678',
        database: 'world'
    })

    connection.query('SELECT 1', function(error, results, fields){
        console.log(error)
    })
}

exports.get = function(){
    return state.pool
}

/*exports.testInsert = function(data, done){
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
}*/

