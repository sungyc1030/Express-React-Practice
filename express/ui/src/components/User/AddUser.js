import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        margin: `4% ${theme.spacing.unit * 2}px`
    },
    fab:{
        margin: `${theme.spacing.unit}`
    },
    userListTop: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginBottom: `${theme.spacing.unit * 2}px`
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.color
    },
    textFieldSelect: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100px',
        color: theme.color
    }
});

const level = [
    'Normal',
    'Silver',
    'Gold'
]

const admin = [
    '사용자',
    '관리자'
]

class AddUser extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            userName: '',
            userNo: 0,
            userAffil: '',
            userPart: '',
            userJob: '',
            userEmail: '',
            userPhone: '',
            userLevel: 'Normal',
            userAdmin: '사용자',
            tooltipOpen: false,
            tooltipMes: '유저번호와 이름은 필수사항입니다.'
        };
    };

    postData = async() => {
        const response = await fetch('/api/user',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: 'Add user',
                userName: this.state.userName,
                userNo: this.state.userNo,
                userAffil: this.state.userAffil,
                userPart: this.state.userPart,
                userJob: this.state.userJob,
                userEmail: this.state.userEmail,
                userPhone: this.state.userPhone,
                userLevel: this.state.userLevel,
                userAdmin: this.state.userAdmin
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }
 
    handleNewUser = () => {
        if(this.state.userName === '' || this.state.userNo === 0){
            this.setState({tooltipOpen: true});
        }else{
            this.setState({tooltipOpen: false});

            this.postData()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.addUser();
                        this.handleFormClose();
                    }else{
                        this.setState({tooltipOpen: true, tooltipMes: '서버와의 연결 문제로 유저등록에 실패했습니다.'});
                    }
                }).catch(err => console.log(err));
        }
    };

    handleFormOpen = () => {
        this.setState({ open: true, tooltipOpen: false});
    };

    handleFormClose = () => {
        this.setState({ open: false, tooltipOpen: false});
    };

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    dialogEnter = () =>{
        this.setState({
            userName: '',
            userNo: 0,
            userAffil: '',
            userPart: '',
            userJob: '',
            userEmail: '',
            userPhone: '',
            userLevel: 'Normal',
            userAdmin: '사용자',
            tooltipOpen: false,
            tooltipMes: '유저번호와 이름은 필수사항입니다.'
        });
    }

    render(){
        const {classes} = this.props;
        return(
            <div>
                <div className={classes.userListTop}>
                <Fab color="primary" aria-label="Add" className={classes.fab} size="small" onClick={this.handleFormOpen}>
                    <Add />
                </Fab>
                </div>
                <Dialog open={this.state.open} onClose={this.handleFormClose} onEnter={this.dialogEnter} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">신규유저생성</DialogTitle>
                    <DialogContent>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.userName} onChange={this.handleTextFieldChange('userName')} margin="normal" variant="outlined" />
                        <TextField label="유저번호" className = {classes.textField} 
                            value={this.state.userNo} onChange={this.handleTextFieldChange('userNo')} margin="normal" variant="outlined" />
                        <TextField label="소속" className = {classes.textField} 
                            value={this.state.userAffil} onChange={this.handleTextFieldChange('userAffil')} margin="normal" variant="outlined" />
                        <TextField label="파트" className = {classes.textField} 
                            value={this.state.userPart} onChange={this.handleTextFieldChange('userPart')} margin="normal" variant="outlined" />
                        <TextField label="직종" className = {classes.textField} 
                            value={this.state.userJob} onChange={this.handleTextFieldChange('userJob')} margin="normal" variant="outlined" />
                        <TextField label="이메일" className = {classes.textField} type="email" autoComplete="email"
                            value={this.state.userEmail} onChange={this.handleTextFieldChange('userEmail')} margin="normal" variant="outlined" />
                        <TextField label="전화번호" className = {classes.textField} 
                            value={this.state.userPhone} onChange={this.handleTextFieldChange('userPhone')} margin="normal" variant="outlined" />
                        <TextField label="레벨" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
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
                    </DialogContent>
                    <DialogActions>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.tooltipMes} placement="left">
                            <Button variant="contained" color="primary" onClick={this.handleNewUser}>
                                생성
                            </Button>
                        </Tooltip>
                        <Button variant="contained" color="secondary" onClick={this.handleFormClose}>
                            취소
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AddUser)