const { Model } = require('objection');

class Config extends Model {
    static get tableName(){
        return '출력';
    }
    static get idColumn(){
        return 'ID';
    } 
}

module.exports = Config;