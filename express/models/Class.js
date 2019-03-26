const { Model } = require('objection');

class Class extends Model {
    static get tableName(){
        return '교육';
    }
    static get idColumn(){
        return '교육ID';
    } 
    static get relationMappings() {
        const UserClass = require('./UserClass');
        const User = require('./User');

        return{
            UserClass: {
                relation: Model.HasManyRelation,
                modelClass: UserClass,
                join:{
                    from: '교육.교육ID',
                    to: '출결.교육ID'
                }
            },
            Class: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: '교육.교육ID',
                    through: {
                        from: '출결.교육ID',
                        to: '출결.유저ID'
                    },
                    to: '유저.유저ID'
                }
            }
        };
    };
}

module.exports = Class;