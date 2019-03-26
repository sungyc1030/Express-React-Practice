const { Model } = require('objection');

class UserClass extends Model {
    static get tableName(){
        return '출결';
    }
    static get idColumn(){
        return '출결ID';
    } 
    static get relationMappings() {
        const User = require('./User');
        const Class = require('./Class');

        return{
            User: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from: '출결.유저ID',
                    to: '유저.유저ID'
                }
            },
            Class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: '출결.교육ID',
                    to: '교육.교육ID'
                }
            }
        };
    };
}

module.exports = UserClass;