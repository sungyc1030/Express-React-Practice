import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { TextField, Typography, MenuItem, Button, Divider, Tooltip, Checkbox } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeleteForever, SettingsBackupRestore } from '@material-ui/icons';
import UserDataRow from './UserDataRow';
import AddUserClass from './AddUserClass';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color,
        flexBasis: '18%'
    },
    textFieldEmail: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color,
        flexBasis: '30%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100px',
        color: theme.color
    },
    textFieldSelectLevel: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '150px',
        color: theme.color
    },
    panelBody:{
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    panelHeader:{
        flexBasis: '24%'
    },
    panelSub1:{
        flexBasis: '18%'
    },
    panelSub2:{
        flexBasis: '15%'
    },
    panelSub3:{
        flexBasis: '10%'
    },
    deleteUser:{
        justifyContent: 'center'
    },
    passwordReset:{
        justifyContent: 'center'
    },
    tableClasses:{
        overflowY: 'auto',
        maxHeight: '20vh',
        fontSize: '10px'
    },
    tableClassesCell:{
        padding: `${theme.spacing(1)}px`
    },
    divider:{
        flexBasis: '100%',
        marginTop: '4px',
        marginBottom: '4px'
    },
    buttonMargin:{
        marginLeft: '4px',
        marginRight: '4px'
    },
    scrollTable:{
        maxHeight: '300px',
        overflow: 'auto'
    },
    headerCheckbox:{
        flexBasis: '8%'
    },
    header: {
        alignItems: 'center'
    },
    editButtons: {
        display: 'flex',
        flexDirection: 'row-reverse',
        flexBasis: '100%'
    }
});

const level = [
    'Normal',
    'Silver',
    'Silver+1',
    'Silver+2',
    'Gold'
]

const admin = [
    '사용자',
    '관리자'
]

const status = [
    'Pass',
    'Fail',
    'None'
]

class UserData extends Component{
    constructor(props){
        super(props)

        this.state = {
            userName: '',
            userNo: 0,
            userAffil: '',
            userPart: '',
            userJob: '',
            userEmail: '',
            userPhone: '',
            userLevel: 'Normal',
            userAdmin: '사용자',
            userID: 0,
            userEngName: '',
            allClasses: [],
            tooltipOpen: false,
            tooltipOpenUpdate: false,
            tooltipPassOpen: false,
            passwordResetMessage: '패스워드 리셋에 실패하였습니다.',
            checked: false,
            IssuedDate: '',
            CertificationNumber: '',
            CCDS: '',
            CEPS: '',
            levelChangeDate: '',
            levelChangeDateEnd: ''
        }
    } 

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    componentDidMount(){
        var levelChangeDate;
        var levelChangeDateEnd;
        if(this.props.user.LevelChangeDate == null){
            levelChangeDate = '';
        }else{
            levelChangeDate = new Date(this.props.user.LevelChangeDate);
            levelChangeDate = [levelChangeDate.getFullYear(), ('0' + (levelChangeDate.getMonth() + 1)).slice(-2), ('0' + (levelChangeDate.getDate())).slice(-2)].join('-');
        }
        if(this.props.user.LevelChangeDateEnd == null){
            levelChangeDateEnd = '';
        }else{
            levelChangeDateEnd = new Date(this.props.user.LevelChangeDateEnd);
            levelChangeDateEnd = [levelChangeDateEnd.getFullYear(), ('0' + (levelChangeDateEnd.getMonth() + 1)).slice(-2), ('0' + (levelChangeDateEnd.getDate())).slice(-2)].join('-');
        }

        this.setState({
            userName: this.props.user['이름'],
            userEngName: this.props.user['영문이름']? this.props.user['영문이름']:'',
            userNo: Number(this.props.user['유저번호']),
            userAffil: this.props.user['소속'] ? this.props.user['소속']:'',
            userPart: this.props.user['부서'] ? this.props.user['부서']:'',
            userJob: this.props.user['직종'] ? this.props.user['직종']:'',
            userEmail: this.props.user['이메일'] ? this.props.user['이메일']:'',
            userPhone: this.props.user['전화번호'] ? this.props.user['전화번호']:'',
            userLevel: this.props.user['레벨'],
            userAdmin: this.props.user['애드민'],
            userID: this.props.user['유저ID'],
            allClasses: this.props.user['UserClass'],
            IssuedDate: this.props.user['IssuedDate'],
            CertificationNumber: this.props.user['CertificationNumber'],
            CCDS: this.props.user['CCDS'] ? this.props.user['CCDS']:'Fail',
            CEPS: this.props.user['CEPS'] ? this.props.user['CEPS']:'Fail',
            levelChangeDate: levelChangeDate,
            levelChangeDateEnd: levelChangeDateEnd
        });
    }

    deleteSelectedUser = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpen: false});

        if(window.confirm('정말로 삭제하시겠습니까?')){
            this.queryDeleteSelectedUser()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.deleteUser();
                        window.alert('삭제되었습니다.');
                    }else{
                        this.setState({tooltipOpen: true});
                        setTimeout(() => {
                            this.setState({tooltipOpen: false})
                        }, 1500);
                    }
                }).catch(err => {
                    this.setState({tooltipOpen: true});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                });
        }else{
            window.alert('취소되었습니다.');
        }

    }

    queryDeleteSelectedUser = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var id = this.state.userID;
        if(token !== null){
            response = await fetch('/api/user/' + id,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user/' + id, {
                method: 'DELETE'
            });
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    getUpdatedInformation = () => {
        this.queryGetUpdatedInformation()
            .then(res => {
                if(res.length === 1){
                    window.alert('수정완료!');
                    var levelChangeDate;
                    var levelChangeDateEnd;
                    if(res[0].LevelChangeDate == null){
                        levelChangeDate = '';
                    }else{
                        levelChangeDate = new Date(res[0].LevelChangeDate);
                        levelChangeDate = [levelChangeDate.getFullYear(), ('0' + (levelChangeDate.getMonth() + 1)).slice(-2), ('0' + (levelChangeDate.getDate())).slice(-2)].join('-');
                    }
                    if(res[0].LevelChangeDateEnd == null){
                        levelChangeDateEnd = '';
                    }else{
                        levelChangeDateEnd = new Date(res[0].LevelChangeDateEnd);
                        levelChangeDateEnd = [levelChangeDateEnd.getFullYear(), ('0' + (levelChangeDateEnd.getMonth() + 1)).slice(-2), ('0' + (levelChangeDateEnd.getDate())).slice(-2)].join('-');
                    }
            
                    this.setState({
                        userName: res[0].이름,
                        userEngName: res[0].영문이름? res[0].영문이름:'',
                        userNo: Number(res[0]['유저번호']),
                        userAffil: res[0]['소속'] ? res[0]['소속']:'',
                        userPart: res[0]['부서'] ? res[0]['부서']:'',
                        userJob: res[0]['직종'] ? res[0]['직종']:'',
                        userEmail: res[0]['이메일'] ? res[0]['이메일']:'',
                        userPhone: res[0]['전화번호'] ? res[0]['전화번호']:'',
                        userLevel: res[0]['레벨'],
                        userAdmin: res[0]['애드민'],
                        userID: res[0]['유저ID'],
                        allClasses: res[0]['UserClass'],
                        IssuedDate: res[0]['IssuedDate'],
                        CertificationNumber: res[0]['CertificationNumber'],
                        CCDS: res[0]['CCDS'] ? res[0]['CCDS']:'Fail',
                        CEPS: res[0]['CEPS'] ? res[0]['CEPS']:'Fail',
                        levelChangeDate: levelChangeDate,
                        levelChangeDateEnd: levelChangeDateEnd
                    });
                }else{
                    this.setState({tooltipOpenUpdate: true});
                    setTimeout(() => {
                        this.setState({tooltipOpenUpdate: false})
                    }, 1500);
                }
            }).catch(err => {
                console.log(err);
                this.setState({tooltipOpenUpdate: true});
                setTimeout(() => {
                    this.setState({tooltipOpenUpdate: false})
                }, 1500);
            })
    }

    queryGetUpdatedInformation = async() => {
        var id = this.state.userID;
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user/' + id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user/' + id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
        
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    updateSelectedUser = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpenUpdate: false});

        this.queryUpdateSelectedUser()
            .then(res => {
                if(res.mes === 'Success'){
                    //this.props.updateUser();
                    this.getUpdatedInformation();
                }else{
                    this.setState({tooltipOpenUpdate: true});
                    setTimeout(() => {
                        this.setState({tooltipOpenUpdate: false})
                    }, 1500);
                }
            }).catch(err => {
                this.setState({tooltipOpenUpdate: true});
                setTimeout(() => {
                    this.setState({tooltipOpenUpdate: false})
                }, 1500);
            });
    }

    queryUpdateSelectedUser = async() => {
        var id = this.state.userID;
        var data = JSON.stringify({
            post: 'Update user',
            userName: this.state.userName,
            userNo: this.state.userNo,
            userAffil: this.state.userAffil,
            userPart: this.state.userPart,
            userJob: this.state.userJob,
            userEmail: this.state.userEmail,
            userPhone: this.state.userPhone,
            userLevel: this.state.userLevel,
            userAdmin: this.state.userAdmin,
            userEngName: this.state.userEngName,
            IssuedDate: this.state.IssuedDate,
            CertificationNumber: this.state.CertificationNumber,
            CCDS: this.state.CCDS,
            CEPS: this.state.CEPS,
            LevelChangeDate: this.state.levelChangeDate,
            LevelChangeDateEnd: this.state.levelChangeDateEnd
        }); 
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user/' + id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/user/' + id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
            });
        }
        
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    passwordReset = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipPassOpen: false});

        this.queryResetPasswordForUser()
            .then(res => {
                if(res.mes === 'Success'){
                    this.setState({tooltipPassOpen: true, passwordResetMessage: '성공'});
                    setTimeout(() => {
                        this.setState({tooltipPassOpen: false})
                    }, 1500);
                }else{
                    this.setState({tooltipPassOpen: true, passwordResetMessage: '패스워드 리셋에 실패하였습니다.'});
                    setTimeout(() => {
                        this.setState({tooltipPassOpen: false})
                    }, 1500);
                }
            }).catch(err => {
                this.setState({tooltipPassOpen: true, passwordResetMessage: '패스워드 리셋에 실패하였습니다.'});
                setTimeout(() => {
                    this.setState({tooltipPassOpen: false})
                }, 1500);
            });
    }

    queryResetPasswordForUser = async() => {
        var id = this.state.userID;
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            userNo: this.state.userNo,
            post: 'Reset Password',
            userName: this.state.userName
        });
        if(token !== null){
            response = await fetch('/api/user/preset/' + id, {
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               },
               body: data
            });
        }else{
            response = await fetch('/api/user/preset/' + id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
             });
        }

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    createUserRow = () => {
        var list = this.state.allClasses.map((row, index) => (
            <UserDataRow data={row} key={row['교육ID']} changeUser={this.props.updateUser} userID={this.state.userID}/>
        ));
        return list;
    }

    handleCheckboxClick = () => event => {
        event.stopPropagation();
        this.setState({checked: !this.state.checked});
        this.props.deleteChecks(this.state.userID);
    }

    render(){
        const {classes} = this.props;

        var renderHelper;

        if(this.state.allClasses.length === 0){
            renderHelper = 
                <Typography>
                    참가하고 있는 교육이 없습니다. 교육을 추가해주십시오.
                </Typography>
        }else{
            renderHelper = 
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableClassesCell} align="center">교육명</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">교육일</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">역할</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">참가여부</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">KAPA인증</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">ARC인증</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">수정</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">삭제</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.createUserRow()}
                            </TableBody>
                        </Table>
        }

        return(
            <div className = {classes.root}>
                <ExpansionPanel TransitionProps={{ unmountOnExit: true }} >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.header }}>
                        <div className={classes.headerCheckbox}>
                            <Checkbox 
                                checked={this.state.checked}
                                onClick={this.handleCheckboxClick()}
                                value="Checked"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                        </div>
                        <Typography className={classes.panelHeader} classes={{button:classes.headerTypo}} variant="button" >
                            {this.state.userNo + ' : ' + this.state.userName}
                        </Typography>
                        <Typography className={classes.panelSub1} classes={{button:classes.headerTypo}} variant="button" >
                            {'소속:   ' + this.state.userAffil}
                        </Typography>
                        <Typography className={classes.panelSub2} classes={{button:classes.headerTypo}} variant="button" >
                            {'직종:   ' + this.state.userJob}
                        </Typography>
                        <Typography className={classes.panelSub3} classes={{button:classes.headerTypo}} variant="button" >
                            {this.state.userLevel}
                        </Typography>
                        <Tooltip open={this.state.tooltipPassOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.passwordResetMessage} placement="top">
                            <Button className={classes.passwordReset} onClick={this.passwordReset}>
                                <SettingsBackupRestore/>
                                <Typography variant="button" classes={{button:classes.headerTypo}}>
                                    비밀번호초기화
                                </Typography>
                            </Button>
                        </Tooltip>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title="삭제에 실패하였습니다." placement="top">
                            <Button className={classes.deleteUser} onClick={this.deleteSelectedUser}>
                                <DeleteForever/>
                                <Typography variant="button" classes={{button:classes.headerTypo}}>
                                    삭제
                                </Typography>
                            </Button>
                        </Tooltip>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelBody}>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.userName} onChange={this.handleTextFieldChange('userName')} margin="normal" variant="outlined" />
                        <TextField label="영문이름" className = {classes.textField} 
                            value={this.state.userEngName? this.state.userEngName: ''} onChange={this.handleTextFieldChange('userEngName')} margin="normal" variant="outlined" />
                        <TextField label="면허번호" className = {classes.textField} 
                            value={this.state.userNo} onChange={this.handleTextFieldChange('userNo')} margin="normal" variant="outlined" />
                        <TextField label="소속" className = {classes.textField} 
                            value={this.state.userAffil? this.state.userAffil: ''} onChange={this.handleTextFieldChange('userAffil')} margin="normal" variant="outlined" />
                        <TextField label="부서" className = {classes.textField} 
                            value={this.state.userPart? this.state.userPart: ''} onChange={this.handleTextFieldChange('userPart')} margin="normal" variant="outlined" />
                        <TextField label="직종" className = {classes.textField} 
                            value={this.state.userJob? this.state.userJob: ''} onChange={this.handleTextFieldChange('userJob')} margin="normal" variant="outlined" />
                        <TextField label="이메일" className = {classes.textFieldEmail} type="email" autoComplete="email"
                            value={this.state.userEmail? this.state.userEmail: ''} onChange={this.handleTextFieldChange('userEmail')} margin="normal" variant="outlined" />
                        <TextField label="전화번호" className = {classes.textField} 
                            value={this.state.userPhone? this.state.userPhone: ''} onChange={this.handleTextFieldChange('userPhone')} margin="normal" variant="outlined" />
                        <TextField label="이슈날짜" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                            value={this.state.IssuedDate? this.state.IssuedDate: ''} onChange={this.handleTextFieldChange('IssuedDate')} margin="normal" variant="outlined" />
                        <TextField label="증명번호" className = {classes.textField} 
                            value={this.state.CertificationNumber? this.state.CertificationNumber: ''} onChange={this.handleTextFieldChange('CertificationNumber')} margin="normal" variant="outlined" />
                        <TextField label="레벨" select className = {classes.textFieldSelectLevel} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.userLevel} onChange={this.handleTextFieldChange('userLevel')} margin="normal" variant="outlined">
                            {level.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="권한" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.userAdmin} onChange={this.handleTextFieldChange('userAdmin')} margin="normal" variant="outlined" >
                            {admin.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="CCDS" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.CCDS} onChange={this.handleTextFieldChange('CCDS')} margin="normal" variant="outlined" >
                            {status.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="CEPS" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.CEPS} onChange={this.handleTextFieldChange('CEPS')} margin="normal" variant="outlined" >
                            {status.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="자격시작일" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                            value={this.state.levelChangeDate} onChange={this.handleTextFieldChange('levelChangeDate')}  margin="normal" variant="outlined" />
                        <TextField label="자격만료일" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                            value={this.state.levelChangeDateEnd} onChange={this.handleTextFieldChange('levelChangeDateEnd')} margin="normal" variant="outlined" />
                        <Divider className = {classes.divider} />
                        <div className = {classes.editButtons}>
                            <Button onClick={() => {this.props.print(this.state.userEngName, this.state.userLevel, this.state.IssuedDate, this.state.CertificationNumber);}} 
                                size="small" variant="outlined" disabled={this.state.userLevel === 'Normal'}>
                                인증서 출력
                            </Button>
                            <Tooltip open={this.state.tooltipOpenUpdate} disableFocusListener disableHoverListener disableTouchListener
                                title="수정에 실패하였습니다." placement="left">
                                <Button className={classes.buttonMargin} size="small" variant="outlined" onClick={this.updateSelectedUser}>유저정보수정</Button>
                            </Tooltip>
                        </div>
                        <Divider className = {classes.divider} />
                        {renderHelper}
                        <div className = {classes.editButtons}>
                            <AddUserClass data={this.props.user} userClass={this.props.userClass} updateUser={this.props.updateUser}/>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(UserData)