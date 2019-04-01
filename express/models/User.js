const { Model } = require('objection');
const bcrypt = require('bcryptjs');

class User extends Model {
    static get tableName(){
        return '유저';
    }
    static get idColumn(){
        return '유저ID';
    } 
    set password (password){
        this.비밀번호 = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    };
    verifyPassword (password, callback){
        bcrypt.compare(password, this.비밀번호, callback)
    };
    static get jsonSchema(){
        return{
            type: 'object',
            required: ['유저번호', '이름'],

            properties:{
                유저ID: {type: 'integer'},
                유저번호: {type: 'long'},
                이름: {type: 'string'},
                비밀번호: {type: ['string', 'null']},
                소속: {type: ['string', 'null']},
                파트: {type: ['string', 'null']},
                직종: {type: ['string', 'null']},
                이메일: {type: ['string', 'null']},
                전화번호: {type: ['string', 'null']},
                레벨: {type: ['string', 'null']},
                애드민: {type: ['string', 'null']},
                로그인ID: {type: ['string', 'null']}
            }
        }
    };
    static get relationMappings() {
        const UserClass = require('./UserClass');
        const Class = require('./Class');

        return{
            UserClass: {
                relation: Model.HasManyRelation,
                modelClass: UserClass,
                join:{
                    from: '유저.유저ID',
                    to: '출결.유저ID'
                }
            },
            Class: {
                relation: Model.ManyToManyRelation,
                modelClass: Class,
                join: {
                    from: '유저.유저ID',
                    through: {
                        from: '출결.유저ID',
                        to: '출결.교육ID'
                    },
                    to: '교육.교육ID'
                }
            }
        };
    };
}

module.exports = User;