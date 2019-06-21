import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress, Typography, CardHeader, Avatar, Divider } from '@material-ui/core';
import { TextField, Button } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { indigo } from '@material-ui/core/colors'
import AddClass from './AddClass';
import ClassData from './ClassData';
import TopBar from '../TopBar';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
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
    progressDiv: {
        display: 'flex',
        width: '100%',
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
    searchButton:{
        margin: `${theme.spacing(1)}px`
    }
});

class Class extends Component{
    constructor(props){
        super(props)

        var d = new Date(Date.now());
        var month = '' + (d.getMonth() + 1);
        var day = '' + (d.getDate());
        var year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        this.state = {
            classes: [],
            loaded: false,
            empty: false,
            classUser: [],
            search: false,
            searchName: '',
            searchDate1: '2016-01-01',
            searchDate2: year + '-' + month + '-' + day,
            searchUserName: '',
            searchUserNo: '',
            searchUserAffil: '',
            searchUserJob: ''
        }

        this.searchUpdate = false
        this.toBeDeleted = new Set();
    }

    getData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/class', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/class');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    getUserData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user/pure', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user/pure');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    componentDidMount(){
        this.setState({loaded: false});
        let data;
        let user;
        this.getData()
            .then(res1 => {
                if(res1.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    //this.setState({classes: res, loaded: true});
                    data = res1;
                    this.getUserData()
                    .then(res2 => {
                        if(res2.length !== 0){
                            user = res2;
                            this.setState({classUser: user, loaded: true, classes: data});
                            this.searchClass();
                        }
                    }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
    }

    createList = () => {
        const {classes} = this.props;

        var list;
        if(this.state.search && this.searchUpdate){
            list = this.state.classes.map((data, index) => {
                var status = <ClassData class={data} key={data['교육ID']} deleteClass={this.changeClass} updateClass={this.changeClass} 
                    classUser={this.state.classUser} deleteChecks={this.handleChecksForDelete} searchName={this.state.searchUserName} searchNo={this.state.searchUserNo}
                    searchJob={this.state.searchUserJob} searchAffil={this.state.searchUserAffil}/>
                var name = data.교육명;
                if(name.indexOf(this.state.searchName) === -1){
                    status = null;
                }
                var dateTarget = new Date(data.교육일);
                var startDate = new Date(this.state.searchDate1);
                var endDate = new Date(this.state.searchDate2);
                if(dateTarget.getTime() > endDate.getTime() || dateTarget.getTime() < startDate.getTime()){
                    status = null;
                }
                return status;
            });
            this.searchUpdate = false;
        }else if(this.state.search){
            list = <div className = {classes.progressDiv}>
                    <CircularProgress className = {classes.progress}/>
                </div>
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
                    조회된 교육 데이터가 없습니다.
                </Typography>
            }
        }else if(!this.state.search){
            list = <Typography>
                조회된 교육 데이터가 없습니다.
            </Typography>
        }
        return list;
    }

    changeClass = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                    this.searchClass();
                }else{
                    //Force change
                    this.setState({loaded: false});
                    this.setState({classes: res, loaded: true});
                    this.searchClass();
                }
            }).catch(err => console.log(err));
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    searchClass = () => {
        this.searchUpdate = true;
        this.setState({search: true});
    };

    handleMassDelete = () => {
        this.setState({loaded: false});
        this.deleteMassClass()
            .then(res => {
                this.changeClass();
            }).catch(error => {
                this.setState({loaded:true});
                console.log(error);
                alert("삭제에 실패하였습니다.");
            });
    };

    deleteMassClass = async() => {
        //Force change 
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
                ids: Array.from(this.toBeDeleted)
            });
        if(token !== null){
            response = await fetch('/api/class', {
                method: 'DELETE',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/class/', {
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
        let header = "교육명, 교육일, 이름, 면허번호, 직종, 참석여부, KAPA인증, ARC인증, 전화번호, 이메일\n";
        let list = '';
        for(var i = 0; i < this.state.classes.length; i++){
            let data = this.state.classes[i];
            let csvStatus = true;

            if(data.교육명.indexOf(this.state.searchName) === -1){
                csvStatus = false;
            }
            var dateTarget = new Date(data.교육일);
            var startDate = new Date(this.state.searchDate1);
            var endDate = new Date(this.state.searchDate2);
            if(dateTarget.getTime() > endDate.getTime() || dateTarget.getTime() < startDate.getTime()){
                csvStatus = false;
            }

            if(csvStatus){
                let className = data.교육명;
                let classDate = new Date(data.교육일);
                classDate = [classDate.getFullYear(), ('0' + (classDate.getMonth() + 1)).slice(-2), ('0' + (classDate.getDate())).slice(-2)].join('-');
                for(var j = 0; j < data.UserClass.length; j++){
                    let userClass = data.UserClass[j];

                    let userName = userClass.User.이름;
                    let userNo = userClass.User.유저번호;
                    let userJob = userClass.User.직종;
                    let userPart = userClass.참가여부;
                    let KAPA = userClass.KAPA;
                    let ARC = userClass.ARC;
                    let userTel = userClass.User.전화번호;
                    let userMail = userClass.User.이메일;
                    list = list + className + ',' + classDate + ',' + userName + ',' + userNo + ',' + userJob + ',' + userPart +
                        ',' + KAPA + ',' + ARC + ',' + userTel + ',' + userMail + '\n';
                }
            }
        }
        csvData = universalBOM + header + list;
        return csvData;
    }

    render(){
        const {classes} = this.props;

        var renderHelper;
        var renderSearch = 
            <div>
            <div className={classes.searchFields}>
                <TextField label="Name" className = {classes.textField} 
                    value={this.state.searchName} onChange={this.handleTextFieldChange('searchName')} margin="normal" variant="outlined" />
                <TextField label="Date of Class" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                    value={this.state.searchDate1} onChange={this.handleTextFieldChange('searchDate1')} margin="normal" variant="outlined" />
                <Typography>
                    ~
                </Typography>
                <TextField label="Date of Class" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                    value={this.state.searchDate2} onChange={this.handleTextFieldChange('searchDate2')} margin="normal" variant="outlined" />
            </div> 
            <div className={classes.searchFields}>
                <TextField label="User No" className = {classes.textField} 
                    value={this.state.searchUserNo} onChange={this.handleTextFieldChange('searchUserNo')} margin="normal" variant="outlined" />
                <TextField label="User Name" className = {classes.textField} 
                    value={this.state.searchUserName} onChange={this.handleTextFieldChange('searchUserName')} margin="normal" variant="outlined" />
                <TextField label="User Affiliation" className = {classes.textField} 
                    value={this.state.searchUserAffil} onChange={this.handleTextFieldChange('searchUserAffil')} margin="normal" variant="outlined" />
                <TextField label="User Job" className = {classes.textField} 
                    value={this.state.searchUserJob} onChange={this.handleTextFieldChange('searchUserJob')} margin="normal" variant="outlined" />
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
                <Button onClick={this.searchClass} className={classes.searchButton} color="primary" variant="contained">
                    <Typography variant="button">
                        조회
                    </Typography>
                </Button>     
                <AddClass addClass={this.changeClass} />
            </div>
            
            </div>

        if(this.state.loaded){
            if(this.state.empty){
                renderHelper = 
                    <CardContent>
                        <AddClass addClass = {this.changeClass}/>
                        <Typography>
                            존재하는 교육 데이터가 없습니다. 새로 추가해주시기 바랍니다.
                        </Typography>
                    </CardContent>
            }else{
                renderHelper = 
                    <React.Fragment>
                        {renderSearch}
                        <CardContent>
                            {this.createList()}
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
                                    <Avatar style={{backgroundColor: indigo[500]}}>
                                        <Book />
                                    </Avatar>
                                }
                                title="교육 및 출결 관리"
                            />
                            <Divider/>
                            {renderHelper}
                        </Card> 
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Class);