import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress, Typography, CardHeader, Avatar, Divider } from '@material-ui/core';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { Face } from '@material-ui/icons';
import { lime } from '@material-ui/core/colors'
import UserData from './UserData';
import AddUser from './AddUser'
import TopBar from '../TopBar';
import UserCertificate from './UserCertificate';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`,
    },
    mainPaper: {
        width : '100%',
        overflowY: 'auto',
        maxHeight: '80vh'
    },
    progress: {
        margin: `${theme.spacing(2)}px`
    },
    progressWrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
    searchFields: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color
    },
    textFieldSelectLevel: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color,
    },
    userButtons: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginTop: `${theme.spacing(1)}px`,
        marginBottom: `${theme.spacing(1)}px`
    },
    progressDiv: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
    },
    searchButton:{
        margin: `${theme.spacing(1)}px`
    },
    FirstItem:{
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    LastItem: {
        marginTop: 'auto',
        fontSize: '0.8rem',
        marginRight: '1vw',
        marginLeft: 'auto'
    }
});

const level = [
    'Normal',
    'Silver',
    'Silver+1',
    'Silver+2',
    'Gold'
];

const statusIbhre = [
    'Pass',
    'None'
];

class User extends Component{
    constructor(props){
        super(props)

        var d = new Date(Date.now());
        var month = '' + (d.getMonth() + 1);
        var day = '' + (d.getDate());
        var year = d.getFullYear() + 1;

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        this.state = {
            users: [],
            loaded: false,
            empty: false,
            userClass: [],
            page: 0,
            searchName: '',
            searchAffil: '',
            searchJob: '',
            searchDate1: '2000-01-01',
            searchDate2: year + '-' + month + '-' + day,
            searchLevel1: 'Normal',
            searchLevel2: 'Gold',
            searchCCDS: 'None',
            searchCEPS: 'None',
            search: false,
            userCount: 0,
            //printShow: false
        }

        this.start = 0
        this.end = 0
        this.searchUpdate = false
        this.toBeDeleted = new Set();
        this.cert = React.createRef();
    }

    getData = async() => {
        //Force change 
        this.setState({loaded: false});
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    getClassData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/class/pure', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/class/pure');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    componentDidMount(){
        this.setState({loaded: false});
        //let user;
        //let userclass;
        this.searchUser();
        /*this.getData()
            .then(res1 => {
                if(res1.length === 0){
                    this.setState({empty:true, loaded: true});
                }else{
                    //this.setState({users: res});
                    user = res1;
                    this.getClassData()
                        .then(res2 => {
                            if(res2.length !== 0){
                                //this.setState({userClass: res});
                                userclass = res2;
                                this.setState({users: user, userClass: userclass, loaded: true})
                                this.searchUser();
                            }
                        }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));*/
    }

    changeUser = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                    this.searchUser();
                }else{
                    //Force change
                    //this.setState({loaded: false});
                    this.setState({users: res, loaded: true});
                    this.searchUser();
                }
            }).catch(err => console.log(err));
    }

    printUserCertificate = (userEngName, userLevel, userIssueDate, UserCertificateNo) => {
        //this.setState({printShow: true});
        //this.printShow = true;
        this.cert.current.showCertificate(userEngName, userLevel, userIssueDate, UserCertificateNo);
    }

    closeUserCertificate = () => {
        //this.setState({printShow: false});
        //this.printShow = false;
        this.cert.current.hideCertificate();
    }

    createList = () => {
        //const {classes} = this.props;

        var list;
        if(this.state.search && this.searchUpdate){
            list = this.state.users.map((data, index) => {
                var status = <UserData user={data} key={data['유저ID']} deleteUser={this.changeUser} updateUser={this.changeUser} userClass={this.state.userClass}
                                deleteChecks={this.handleChecksForDelete} print={this.printUserCertificate}/>;
                var name = data.이름;
                if(name.indexOf(this.state.searchName) === -1){
                    status = null;
                }
                if(data.소속.indexOf(this.state.searchAffil) === -1){
                    status = null;
                }
                if(data.직종.indexOf(this.state.searchJob) === -1){
                    status = null;
                }
                var dateTarget = new Date(data.IssuedDate);
                var startDate = new Date(this.state.searchDate1);
                var endDate = new Date(this.state.searchDate2);
                if(data.IssuedDate == null){
                    //should be null when the time comes
                }else if(dateTarget.getTime() > endDate.getTime() || dateTarget.getTime() < startDate.getTime()){
                    status = null;
                }
                //var orSearch = 2;
                var startLevelPos, endLevelPos, targetLevelPos;
                for(var i = 0; i < level.length; i++){
                    if(level[i] === data.레벨){
                        targetLevelPos = i
                    }
                    if(level[i] === this.state.searchLevel1){
                        startLevelPos = i
                    }
                    if(level[i] === this.state.searchLevel2){
                        endLevelPos = i
                    }
                }
                if(targetLevelPos < startLevelPos || targetLevelPos > endLevelPos){
                    status = null;
                }
                if(this.state.searchCCDS === 'Pass'){
                    if(data.CCDS !== this.state.searchCCDS){
                        //orSearch -= 1;
                        status = null;
                    }
                }
                if(this.state.searchCEPS === 'Pass'){
                    if(data.CEPS !== this.state.searchCEPS){
                        //orSearch -= 1;
                        status = null;
                    }
                }
                /*if(orSearch === 0){
                    status = null;
                }*/
                return status;
            });
            this.searchUpdate = false;
        }else if(this.state.search){
            /*list = <div className = {classes.progressDiv}>
                    <CircularProgress className = {classes.progress}/>
                </div>*/
            list = null;
        }
        if(Array.isArray(list)){
            var arrayStatus = false;
            for(var j = 0; j < list.length; j++){
                if(list[j] != null){
                    arrayStatus = true;
                    break;
                }
            }
            if(!arrayStatus){
                list = <Typography>
                    조회된 유저 데이터가 없습니다.
                </Typography>
            }
        }else if(!this.state.search){
            list = <Typography>
                조회된 유저 데이터가 없습니다.
            </Typography>
        }
        return list;
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    searchUser = () => {
        //In case of update, load in data again
        let user;
        let userclass;
        this.setState({search:false});
        this.getData()
            .then(res1 => {
                if(res1.length === 0){
                    this.setState({empty:true, loaded: true, printShow: false});
                    console.log(this.userCount)
                }else{
                    //this.setState({users: res});
                    user = res1;
                    this.getClassData()
                        .then(res2 => {
                            if(res2.length !== 0){
                                //this.setState({userClass: res});
                                userclass = res2;
                                this.searchUpdate = true;
                                let userCount = this.getUserCount(user);
                                this.setState({users: user, userClass: userclass, loaded: true, search: true, userCount: userCount, printShow: false});
                            }
                        }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
    }

    getUserCount = (users) => {
        let count = 0;
        for(var i = 0; i < users.length; i++){
            let data = users[i];
            let status = '';
            if(data.이름.indexOf(this.state.searchName) === -1){
                status = null;
            }
            if(data.소속.indexOf(this.state.searchAffil) === -1){
                status = null;
            }
            if(data.직종.indexOf(this.state.searchJob) === -1){
                status = null;
            }
            var dateTarget = new Date(data.IssuedDate);
            var startDate = new Date(this.state.searchDate1);
            var endDate = new Date(this.state.searchDate2);
            if(data.IssuedDate == null){
                //should be null when the time comes
            }else if(dateTarget.getTime() > endDate.getTime() || dateTarget.getTime() < startDate.getTime()){
                status = null;
            }
            //var orSearch = 2;
            var startLevelPos, endLevelPos, targetLevelPos;
            for(var j = 0; j < level.length; j++){
                if(level[j] === data.레벨){
                    targetLevelPos = j
                }
                if(level[j] === this.state.searchLevel1){
                    startLevelPos = j
                }
                if(level[j] === this.state.searchLevel2){
                    endLevelPos = j
                }
            }
            if(targetLevelPos < startLevelPos || targetLevelPos > endLevelPos){
                status = null;
            }
            if(this.state.searchCCDS === 'Pass'){
                if(data.CCDS !== this.state.searchCCDS){
                    //orSearch -= 1;
                    status = null;
                }
            }
            if(this.state.searchCEPS === 'Pass'){
                if(data.CEPS !== this.state.searchCEPS){
                    //orSearch -= 1;
                    status = null;
                }
            }
            /*if(orSearch === 0){
                status = null;
            }*/
            if(status !== null){
                count += 1;
            }
        }
        return count;
    }

    handleMassDelete = () => {
        this.setState({loaded: false});
        this.deleteMassUser()
            .then(res => {
                this.changeUser();
            }).catch(error => {
                this.setState({loaded:true});
                console.log(error);
                alert("삭제에 실패하였습니다.");
            });
    }

    deleteMassUser = async() => {
        //Force change 
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
                ids: Array.from(this.toBeDeleted)
            });
        if(token !== null){
            response = await fetch('/api/user', {
                method: 'DELETE',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/user/', {
                method: 'DELETE'
            });
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    handleChecksForDelete = (id) => {
        if(this.toBeDeleted.has(id)){
            this.toBeDeleted.delete(id);
        }else{
            this.toBeDeleted.add(id);
        }   
    }

    handleOutputCSV = () => {
        let filename = new Date();
        filename = filename.toString() + ".csv";

        let csv = this.createCSV();

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;'});

        let link = document.createElement("a");
        if(link.download !== undefined){
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    createCSV = () => {
        let csvData;
        let universalBOM = "\uFEFF";
        let header = "이름, 면허번호, 직종, 소속, 전화번호, 이메일, 레벨, 자격취득날짜\n";
        let list = '';
        for(var i = 0; i < this.state.users.length; i++){
            let data = this.state.users[i];
            let csvStatus = true;

            if(data.이름.indexOf(this.state.searchName) === -1){
                csvStatus = false;
            }
            if(data.소속.indexOf(this.state.searchAffil) === -1){
                csvStatus = false;
            }
            if(data.직종.indexOf(this.state.searchJob) === -1){
                csvStatus = false;
            }
            var dateTarget = new Date(data.IssuedDate);
            var startDate = new Date(this.state.searchDate1);
            var endDate = new Date(this.state.searchDate2);
            if(data.IssuedDate == null){
                //should be null when the time comes
            }else if(dateTarget.getTime() > endDate.getTime() || dateTarget.getTime() < startDate.getTime()){
                csvStatus = false;
            }
            var orSearch = 3;
            var startLevelPos, endLevelPos, targetLevelPos;
            for(var j = 0; j < level.length; j++){
                if(level[j] === data.레벨){
                    targetLevelPos = j
                }
                if(level[j] === this.state.searchLevel1){
                    startLevelPos = j
                }
                if(level[j] === this.state.searchLevel2){
                    endLevelPos = j
                }
            }
            if(targetLevelPos < startLevelPos || targetLevelPos > endLevelPos){
                orSearch -= 1;
            }
            if(data.CCDS !== this.state.searchCCDS){
                orSearch -= 1;
            }
            if(data.CEPS !== this.state.searchCEPS){
                orSearch -= 1;
            }
            if(orSearch === 0){
                csvStatus = false;
            }

            if(csvStatus){
                let levelDate = new Date(data.LevelChangeDate);
                levelDate = [levelDate.getFullYear(), ('0' + (levelDate.getMonth() + 1)).slice(-2), ('0' + (levelDate.getDate())).slice(-2)].join('-');
                //"이름, 면허번호, 직종, 소속, 전화번호, 이메일, 레벨, 자격취득날짜\n";
                list = list + data.이름 + ',' + data.유저번호 + ',' + data.직종 + ',' + data.소속 + ',' + data.전화번호 + ',' + data.이메일 +
                    ',' + data.레벨 + ',' + levelDate + '\n';
            }
        }
        csvData = universalBOM + header + list;
        return csvData;
    }

    componentDidUpdate = () => {
        
    }


    render(){
        const {classes} = this.props;

        var renderHelper;
        var renderSearch = 
            <div>
            <div className={classes.searchFields}>
                <TextField label="Name" className = {classes.textField} 
                    value={this.state.searchName} onChange={this.handleTextFieldChange('searchName')} margin="normal" variant="outlined" />
                <TextField label="Afilliation" className = {classes.textField} 
                    value={this.state.searchAffil} onChange={this.handleTextFieldChange('searchAffil')} margin="normal" variant="outlined" />
                <TextField label="Job Name" className = {classes.textField}
                    value={this.state.searchJob} onChange={this.handleTextFieldChange('searchJob')} margin="normal" variant="outlined" />
            </div>
            <div className={classes.searchFields}>
                <div className = {classes.FirstItem}>
                </div>
                <TextField label="Issued Date" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                    value={this.state.searchDate1} onChange={this.handleTextFieldChange('searchDate1')} margin="normal" variant="outlined" />
                <Typography>
                    ~
                </Typography>
                <TextField label="Issued Date" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                    value={this.state.searchDate2} onChange={this.handleTextFieldChange('searchDate2')} margin="normal" variant="outlined" />
                <TextField label="Level" select className = {classes.textFieldSelectLevel} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                    value={this.state.searchLevel1} onChange={this.handleTextFieldChange('searchLevel1')} margin="normal" variant="outlined">
                    {level.map(option => (
                        <MenuItem key={option} value={option} className={classes.selectItem}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography>
                    ~
                </Typography>
                <TextField label="Level" select className = {classes.textFieldSelectLevel} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                    value={this.state.searchLevel2} onChange={this.handleTextFieldChange('searchLevel2')} margin="normal" variant="outlined">
                    {level.map(option => (
                        <MenuItem key={option} value={option} className={classes.selectItem}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField label="CCDS" select className = {classes.textFieldSelectLevel} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                    value={this.state.searchCCDS} onChange={this.handleTextFieldChange('searchCCDS')} margin="normal" variant="outlined">
                    {statusIbhre.map(option => (
                        <MenuItem key={option} value={option} className={classes.selectItem}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField label="CEPS" select className = {classes.textFieldSelectLevel} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                    value={this.state.searchCEPS} onChange={this.handleTextFieldChange('searchCEPS')} margin="normal" variant="outlined">
                    {statusIbhre.map(option => (
                        <MenuItem key={option} value={option} className={classes.selectItem}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography className={classes.LastItem}>
                    {'Total Users : ' + this.state.userCount}
                </Typography>
            </div>  
            <Divider/>
            <div className={classes.userButtons}>  
                <Button className={classes.searchButton} color="primary" variant="contained" onClick={this.handleOutputCSV}>
                    <Typography variant="button">
                        출력
                    </Typography>
                </Button>   
                <Button className={classes.searchButton} color="primary" variant="contained" onClick={this.handleMassDelete}>
                    <Typography variant="button">
                        선택삭제
                    </Typography>
                </Button>
                <Button onClick={this.searchUser} className={classes.searchButton} color="primary" variant="contained">
                    <Typography variant="button">
                        조회
                    </Typography>
                </Button>     
                <AddUser addUser={this.changeUser} />
            </div>
            
            </div>

        if(this.state.loaded){
            if(this.state.empty){
                renderHelper = 
                    <CardContent>
                        <AddUser addUser={this.changeUser} />
                        <Typography>
                            존재하는 유저 데이터가 없습니다. 새로 추가해주시기 바랍니다.
                        </Typography>
                    </CardContent>
            }else{
                renderHelper = 
                        <React.Fragment>
                            {renderSearch}
                            <CardContent>    
                                    {/*<AddUser addUser={this.changeUser}/>*/}
                                    {this.createList()}
                                    {/*<CircularProgress className = {classes.progress}/>*/}
                            </CardContent>
                        </React.Fragment>
            }
        }else{
            renderHelper = 
                <CardContent className={classes.progressWrapper}>
                    <CircularProgress className = {classes.progress}/>
                </CardContent>
        }

        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={4} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={4}>
                        <Card className={classes.mainPaper}>
                            <CardHeader
                                avatar = {
                                    <Avatar style={{backgroundColor: lime[500]}}>
                                        <Face />
                                    </Avatar>
                                }
                                title="사용자 및 출결 관리"
                            />
                            <Divider/>
                            {renderHelper}
                        </Card> 
                    </Grid>
                </Grid>
                <UserCertificate ref={this.cert} show={this.printShow} close={this.closeUserCertificate}/>
            </div>
        );
    }
}

export default withStyles(styles)(User);