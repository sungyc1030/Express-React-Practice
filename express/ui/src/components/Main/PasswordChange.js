import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Tooltip } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    div:{
        display: 'flex'
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    passwordField: {
        margin: '16px'
    },
    passwordCard: {
        display: 'flex',
        flexDirection: 'column',
        width: '40vw',
        height: '50vh',
        justifyContent: 'space-evenly'
    },
    passwordDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: '100%',
        marginTop: '20px',
        marginBottom: '20px',
        marginLeft: '40px',
        marginRight: '40px',
        padding: '5px'
    }
});

class PasswordChange extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            tooltipOpen: false,
            tooltipMes: '패스워드 변경에 실패하였습니다.',
            oldPass: '',
            newPass: '',
            newPassCheck: ''
        }
    }

    handleFormClose = () => {
        this.setState({open:false, tooltipOpen: false});
    }

    handleFormOpen = () => {
        this.setState({ open: true, tooltipOpen: false});
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handlePasswordSubmit = () => {
        this.setState({tooltipOpen: false});

        if(this.state.newPass !== this.state.newPassCheck){
            this.setState({tooltipOpen: true, tooltipMes: '새 패스워드가 서로 맞지 않습니다. 다시한번 확인해 주세요.'});
            setTimeout(() => {
                this.setState({tooltipOpen: false})
            }, 1500);

        }else if(this.state.newPass === this.state.oldPass){
            this.setState({tooltipOpen: true, tooltipMes: '변경하시는 패스워드는 서로 달라야 합니다.'});
            setTimeout(() => {
                this.setState({tooltipOpen: false})
            }, 1500);
        }else{
            this.queryPasswordChange()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.setState({tooltipOpen: true, tooltipMes: '패스워드 변경에 성공하였습니다.'});
                        setTimeout(() => {
                            this.setState({tooltipOpen: false})
                        }, 1500);
                    }else if(res.mes === 'Wrong Initial Password'){
                        this.setState({tooltipOpen: true, tooltipMes: '이전 패스워드가 맞지 않습니다.'});
                        setTimeout(() => {
                            this.setState({tooltipOpen: false})
                        }, 1500);
                    }else{
                        this.setState({tooltipOpen: true, tooltipMes: '패스워드 변경에 실패하였습니다.'});
                        setTimeout(() => {
                            this.setState({tooltipOpen: false})
                        }, 1500);
                    }
                }).catch(err => {
                    this.setState({tooltipOpen: true, tooltipMes: '패스워드 변경에 실패하였습니다.'});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                })
        }
    }

    queryPasswordChange = async() => {
        var id = this.props.user.유저ID;
        var userno = this.props.user.유저번호;
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            userNo: userno,
            post: 'Change Password',
            oldPass: this.state.oldPass,
            newPass: this.state.newPass
        });
        if(token !== null){
            response = await fetch('/api/user/pchange/' + id, {
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               },
               body: data
            });
        }else{
            response = await fetch('/api/user/pchange/' + id, {
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
        const { classes } = this.props;
        
        return(
            <div className = {classes.div}>
                <Dialog open={this.state.open} onClose={this.handleFormClose}>
                    <DialogTitle>패스워드 변경</DialogTitle>
                    <DialogContent className={classes.passwordCard}>
                        <div className={classes.passwordDiv}>
                            <TextField label="이전 패스워드" className = {classes.passwordField}
                                value={this.state.oldPass} onChange={this.handleTextFieldChange('oldPass')} margin="normal">
                            </TextField>
                            <TextField label="새 패스워드" className = {classes.passwordField}
                                value={this.state.newPass} onChange={this.handleTextFieldChange('newPass')} margin="normal">
                            </TextField>
                            <TextField label="새 패스워드 확인" className = {classes.passwordField}
                                value={this.state.newPassCheck} onChange={this.handleTextFieldChange('newPassCheck')} margin="normal">
                            </TextField>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.tooltipMes} placement="top">
                            <Button variant="contained" color="primary" onClick={this.handlePasswordSubmit}>
                                변경
                            </Button>
                        </Tooltip>
                        <Button variant="contained" color="secondary" onClick={this.handleFormClose}>
                            취소
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleFormOpen}>
                    <Autorenew className={classes.icon} />
                    패스워드 변경
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(PasswordChange);