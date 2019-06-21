const { Model } = require('objection');

class Certification extends Model {
    static get tableName(){
        return '증명서카운터';
    }
    static get idColumn(){
        return 'ID';
    } 
}

module.exports = Certification;