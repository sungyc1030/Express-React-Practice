var express = require('express');
var router = express.Router({mergeParams: true});
var ErrorHandler = require('../scripts/error');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
var User = require('../models/User');
var Ed = require('../models/Class');
var UserClass = require('../models/UserClass');

router.post('/', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    //Check admin status
    var bearer = req.headers.authorization;
    var token = bearer.replace('Bearer ', '');
    var decoded = jwt_decode(token);
    if(decoded.admin !== '관리자'){
      res.status(401).json(
        {
            message: '관리자 권한이 없습니다.'
        }
      );

      return;
    }

    var dataOut = {
        mes: "Success"
    }

    router.processLevel().then(() =>{
        dataOut.mes = "Success"
        res.send(dataOut);
    }).catch(err => {
        console.log(err);
        dataOut.mes = "Failed"
        res.send(dataOut);
    });
});

router.processLevel = async() => {
    var users = await User.query()
        .skipUndefined()
        .eager('UserClass.Class')
        .catch((err) => {
            ErrorHandler(err, res);
        });

    for(var i = 0; i < users.length; i++){
        let id = users[i].유저ID;
        let level = users[i].레벨;
        let today = new Date();
        let thisYear = today.getFullYear();
        let userClass = users[i].UserClass

        if(level === 'Gold'){
            //Gold의 로직만 다르기 때문에 따로 로직 돌림
            let levelDateEnd = users[i].LevelChangeDateEnd;
            let changeDate = users[i].LevelChangeDate;
            if(levelDateEnd != null){
                levelDateEnd = new Date(levelDateEnd);
            }
            if(changeDate != null){
                changeDate = new Date(changeDate);
            }

            if(levelDateEnd == null){
                //원래는 이런경우 없어야 하지만 초기에는 발생할수 있다. 로직은 같으나 날짜기준을 today로 잡는다.
                if(changeDate == null){
                    //시작일자도 없다면 닶이 없다....
                }else{

                }
            }else if(today.getTime() >= levelDateEnd.getTime() && changeDate != null){
                //5년이 지났다 (levelDateEnd를 잘 주었을 경우)
                let status = {
                    KAPA: 0,
                    ARC: 0
                }

                //지난 5년간 수료한 교육중 KAPA 인증과 ARC 인증된 교육들을 count
                for(var j = 0; j < userClass.length; j++){
                    let current = userClass[j];
                    if(current.KAPA == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                        let classDate = new Date(current.Class.교육일);
                        if((classDate.getTime() >= changeDate.getTime()) && (classDate.getTime() <= levelDateEnd.getTime())){
                            status.KAPA = status.KAPA + 1;
                        }
                    }else if(current.ARC == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                        let classDate = new Date(current.Class.교육일);
                        if((classDate.getTime() >= changeDate.getTime()) && (classDate.getTime() <= levelDateEnd.getTime())){
                            status.ARC = status.ARC + 1;
                        }
                    }
                }

                //골드 갱신값과 비교
                if(status.KAPA >= 5 && status.ARC >= 3){
                    //갱신
                    let updateDate = new Date();
                    let endDate = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
                    let finalLevel = 'Gold';

                    //각 계산된 결과를 저장
                    const patchUser = await User.query()
                        .patch({
                            레벨: finalLevel,
                            LevelChangeDate: updateDate,
                            LevelChangeDateEnd: endDate
                        })    
                        .where('유저ID', id)
                        .catch((err) => {
                            ErrorHandler(err, res);
                            console.log(err);
                        });
                }else{
                    let finalLevel = 'Normal';

                    const patchUser = await User.query()
                        .patch({
                            레벨: finalLevel,
                            LevelChangeDate: null,
                            LevelChangeDateEnd: null
                        })    
                        .where('유저ID', id)
                        .catch((err) => {
                            ErrorHandler(err, res);
                            console.log(err);
                        });
                }
            }else{
                //Gold는 5년간 안 건드림, 아무것도 하지 않으면 된다
            }
        }else if(level === 'Silver+2'){
            //아무것도 하지 않는다
        }else if(level.indexOf('Silver') !== -1){
            //Silver - 3년을 확인하는것이 아니라 silver가 끝나는 날 부터 지금까지 확인한다.
            let status = {
                KAPA: [], //1년전 (Silver), 2년전 (Silver+1), 3년전 (Silver+2)
                ARC: []
            }
            let levelDateEnd = users[i].LevelChangeDateEnd;
            if(levelDateEnd != null){
                levelDateEnd = new Date(levelDateEnd);
            }

            let finalLevel = 'Normal';
            let finalLevelStatus = 0;
            if(level == 'Silver'){
                finalLevelStatus = 1;
            }else if(level == 'Silver+1'){
                finalLevelStatus = 2;
            }/*else if(level == 'Silver+2'){
                finalLevelStatus = 3;
            }*/
            let updateDate = new Date(thisYear + '-' + 1 + '-' + 1); //올해 1월1일로
            updateDate = [updateDate.getFullYear(), ('0' + (updateDate.getMonth() + 1)).slice(-2), ('0' + (updateDate.getDate())).slice(-2)].join('-');
            let endDate = new Date(thisYear + '-' + 12 + '-' + 31); //올해 마지막일로
            endDate = [endDate.getFullYear(), ('0' + (endDate.getMonth() + 1)).slice(-2), ('0' + (endDate.getDate())).slice(-2)].join('-');

            //해당하는 년도 계산
            let endYear = levelDateEnd.getFullYear();
            let loopVar = thisYear - endYear - 1; //올해는 포함하지 않기 때문에 -1

            //status에 년도 결과 대입
            for(var j = 0; j < loopVar; j++){
                status.KAPA.push(false);
                status.ARC.push(false);
            }
            
            //X년전까지의 교육 기록들만 계산
            for(var j = 0; j < userClass.length; j++){
                let current = userClass[j];
                if(current.KAPA == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                    let classDate = new Date(current.Class.교육일);
                    let classYear = classDate.getFullYear();
                    let yearSub = thisYear - classYear - 1;
                    if(yearSub <= loopVar){
                        status.KAPA[yearSub] = true
                    }
                }else if(current.ARC == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                    let classDate = new Date(current.Class.교육일);
                    let classYear = classDate.getFullYear();
                    let yearSub = thisYear - classYear - 1;
                    if(yearSub <= loopVar){
                        status.ARC[yearSub] = true
                    }
                }
            }
            
            //계산된 결과에 따라 레벨 도출
            for(var j = loopVar - 1; j >= 0; j--){
                if(status.KAPA[j] && status.ARC[j]){
                    finalLevelStatus = finalLevelStatus + 1;
                }else{
                    finalLevelStatus = 0;
                }
            }

            if(finalLevelStatus === 3){
                finalLevel = 'Silver+2'
                endDate = new Date(2200,11,31);
            }else if(finalLevelStatus === 2){
                finalLevel = 'Silver+1'
            }else if(finalLevelStatus === 1){
                finalLevel = 'Silver'
            }else{
                finalLevel = 'Normal'
                updateDate = null;
                endDate = null;
            }
            
            console.log(id, status, finalLevel);
            
            //각 계산된 결과를 저장
            const patchUser = await User.query()
                .patch({
                    레벨: finalLevel,
                    LevelChangeDate: updateDate,
                    LevelChangeDateEnd: endDate
                })    
                .where('유저ID', id)
                .catch((err) => {
                    ErrorHandler(err, res);
                    console.log(err);
                });
        }else{
            //Normal - Silver+2 까지는 어쨌든 로직은 똑같다. 기간이 다를뿐
            let status = {
                KAPA: [false,false,false], //1년전 (Silver), 2년전 (Silver+1), 3년전 (Silver+2)
                ARC: [false,false,false]
            }
            let finalLevel = 'Normal';
            let updateDate = new Date(thisYear + '-' + 1 + '-' + 1); //올해 1월1일로
            updateDate = [updateDate.getFullYear(), ('0' + (updateDate.getMonth() + 1)).slice(-2), ('0' + (updateDate.getDate())).slice(-2)].join('-');
            let endDate = new Date(thisYear + '-' + 12 + '-' + 31); //올해 마지막일로
            endDate = [endDate.getFullYear(), ('0' + (endDate.getMonth() + 1)).slice(-2), ('0' + (endDate.getDate())).slice(-2)].join('-');

            //3년전까지의 교육 기록들만 계산
            for(var j = 0; j < userClass.length; j++){
                let current = userClass[j];
                if(current.KAPA == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                    let classDate = new Date(current.Class.교육일);
                    let classYear = classDate.getFullYear();
                    if(thisYear - classYear <= 3){
                        let yearSub = thisYear - classYear - 1;
                        status.KAPA[yearSub] = true
                    }
                }else if(current.ARC == '인정' && (current.참가여부 == '참석' || current.참가여부 == '참가')){
                    let classDate = new Date(current.Class.교육일);
                    let classYear = classDate.getFullYear();
                    if(thisYear - classYear <= 3){
                        let yearSub = thisYear - classYear - 1;
                        status.ARC[yearSub] = true
                    }
                }
            }

            //계산된 결과에 따라 레벨 도출
            if(status.KAPA[0] && status.ARC[0]){
                finalLevel = 'Silver';
                if(status.KAPA[1] && status.ARC[1]){
                    finalLevel = 'Silver+1';
                    if(status.KAPA[2] && status.ARC[2]){
                        finalLevel = 'Silver+2';
                        endDate = new Date(2200,11,31);
                    }
                }
            }

            if(finalLevel == 'Normal'){
                updateDate = null;
                endDate = null;
            }

            //console.log(id, status, finalLevel);

            //각 계산된 결과를 저장
            const patchUser = await User.query()
                .patch({
                    레벨: finalLevel,
                    LevelChangeDate: updateDate,
                    LevelChangeDateEnd: endDate
                })    
                .where('유저ID', id)
                .catch((err) => {
                    ErrorHandler(err, res);
                    console.log(err);
                });
        }
    }
}

module.exports = router;