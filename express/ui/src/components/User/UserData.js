import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions } from '@material-ui/core';
import { TextField, Typography, MenuItem, Button, Divider, Tooltip } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeleteForever, SettingsBackupRestore } from '@material-ui/icons';
import UserDataRow from './UserDataRow';
import AddUserClass from './AddUserClass';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.color,
        flexBasis: '18%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100px',
        color: theme.color
    },
    textFieldSelectLevel: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '150px',
        color: theme.color
    },
    panelBody:{
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    panelHeader:{
        flexBasis: '30%'
    },
    panelSub:{
        flexBasis: '43%'
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
        padding: `${theme.spacing.unit}px`
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
});

const level = [
    'Normal',
    'Silver',
    'Gold대상',
    'Gold'
]

const admin = [
    '사용자',
    '관리자'
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
            allClasses: [],
            tooltipOpen: false,
            tooltipOpenUpdate: false,
            tooltipPassOpen: false,
            passwordResetMessage: '패스워드 리셋에 실패하였습니다.'
        }
    } 

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    componentDidMount(){
        this.setState({
            userName: this.props.user['이름'],
            userNo: Number(this.props.user['유저번호']),
            userAffil: this.props.user['소속'] ? this.props.user['소속']:'',
            userPart: this.props.user['파트'] ? this.props.user['파트']:'',
            userJob: this.props.user['직종'] ? this.props.user['직종']:'',
            userEmail: this.props.user['이메일'] ? this.props.user['이메일']:'',
            userPhone: this.props.user['전화번호'] ? this.props.user['전화번호']:'',
            userLevel: this.props.user['레벨'],
            userAdmin: this.props.user['애드민'],
            userID: this.props.user['유저ID'],
            allClasses: this.props.user['UserClass']
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

    updateSelectedUser = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpenUpdate: false});

        this.queryUpdateSelectedUser()
            .then(res => {
                if(res.mes === 'Success'){
                    this.props.updateUser();
                    window.alert('수정완료!');
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
            userAdmin: this.state.userAdmin
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
                                    <TableCell className={classes.tableClassesCell} align="center">CAS인증</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">ARC인증</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">수정</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">삭제</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.allClasses.map((row, index) => (
                                    <UserDataRow data={row} key={row['교육ID']} changeUser={this.props.updateUser} userID={this.state.userID}/>
                                ))}
                            </TableBody>
                        </Table>
        }

        return(
            <div className = {classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.panelHeader}>
                            {this.state.userNo + ' : ' + this.state.userName}
                        </Typography>
                        <Typography className={classes.panelSub}>
                            {'소속:   ' + this.state.userAffil + ',   파트:   ' 
                                + this.state.userPart + ',   직종:   ' + this.state.userJob}
                        </Typography>
                        <Tooltip open={this.state.tooltipPassOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.passwordResetMessage} placement="top">
                            <Button className={classes.passwordReset} onClick={this.passwordReset}>
                                <SettingsBackupRestore/>
                                <Typography>
                                    비밀번호 초기화
                                </Typography>
                            </Button>
                        </Tooltip>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title="삭제에 실패하였습니다." placement="top">
                            <Button className={classes.deleteUser} onClick={this.deleteSelectedUser}>
                                <DeleteForever/>
                                <Typography>
                                    삭제
                                </Typography>
                            </Button>
                        </Tooltip>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelBody}>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.userName} onChange={this.handleTextFieldChange('userName')} margin="normal" variant="outlined" />
                        <TextField label="유저번호" className = {classes.textField} 
                            value={this.state.userNo} onChange={this.handleTextFieldChange('userNo')} margin="normal" variant="outlined" />
                        <TextField label="소속" className = {classes.textField} 
                            value={this.state.userAffil? this.state.userAffil: ''} onChange={this.handleTextFieldChange('userAffil')} margin="normal" variant="outlined" />
                        <TextField label="파트" className = {classes.textField} 
                            value={this.state.userPart? this.state.userPart: ''} onChange={this.handleTextFieldChange('userPart')} margin="normal" variant="outlined" />
                        <TextField label="직종" className = {classes.textField} 
                            value={this.state.userJob? this.state.userJob: ''} onChange={this.handleTextFieldChange('userJob')} margin="normal" variant="outlined" />
                        <TextField label="이메일" className = {classes.textField} type="email" autoComplete="email"
                            value={this.state.userEmail? this.state.userEmail: ''} onChange={this.handleTextFieldChange('userEmail')} margin="normal" variant="outlined" />
                        <TextField label="전화번호" className = {classes.textField} 
                            value={this.state.userPhone? this.state.userPhone: ''} onChange={this.handleTextFieldChange('userPhone')} margin="normal" variant="outlined" />
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
                        <Divider className = {classes.divider} />
                        {renderHelper}
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        <Tooltip open={this.state.tooltipOpenUpdate} disableFocusListener disableHoverListener disableTouchListener
                            title="수정에 실패하였습니다." placement="left">
                            <Button className={classes.buttonMargin} size="small" variant="outlined" onClick={this.updateSelectedUser}>유저정보수정</Button>
                        </Tooltip>
                        <AddUserClass data={this.props.user} userClass={this.props.userClass} updateUser={this.props.updateUser}/>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(UserData)