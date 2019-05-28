import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Tooltip } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { HowToReg } from '@material-ui/icons';
import PasswordChange from './PasswordChange'

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
    infoDiv: {
        display: 'flex',
        flexDirection: 'column',
        width: '70vw',
        height: '60vh',
        justifyContent: 'space-evenly'
    },
    infoGrid: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: '5px'
    },
    infoGridContainer: {
        height: '80%'
    }
});

class PersonalInfoChange extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            tooltipOpen: false,
            tooltipMes: '정보변경에 실패하였습니다.',
            userEngName: '',
            userAffil: '',
            userPart: '',
            userJob: '',
            userNo: '',
            userEmail: '',
            userPhone: '',
            userID: '',
        }
    }
    
    componentDidMount(){
        this.setState({
            userEngName: this.props.user['영문이름'],
            userNo: Number(this.props.user['유저번호']),
            userAffil: this.props.user['소속'] ? this.props.user['소속']:'',
            userPart: this.props.user['부서'] ? this.props.user['부서']:'',
            userJob: this.props.user['직종'] ? this.props.user['직종']:'',
            userEmail: this.props.user['이메일'] ? this.props.user['이메일']:'',
            userPhone: this.props.user['전화번호'] ? this.props.user['전화번호']:'',
            userID: this.props.user['유저ID']
        });
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

    handleInformationUpdate = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpen: false});

        this.queryInformationUpdate()
            .then(res => {
                if(res.mes === 'Success'){
                    //this.props.updateUser();
                    window.alert('수정완료!');
                    this.props.updated();
                }else{
                    this.setState({tooltipOpen: true, tooltipMes: '정보변경에 실패하였습니다.'});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                }
            }).catch(err => {
                this.setState({tooltipOpen: true, tooltipMes: '정보변경에 실패하였습니다.'});
                setTimeout(() => {
                    this.setState({tooltipOpen: false})
                }, 1500);
            });
    }

    queryInformationUpdate = async() => {
        var id = this.state.userID;
        var data = JSON.stringify({
            post: 'Update user',
            userName: this.props.user['이름'],
            userNo: this.state.userNo,
            userAffil: this.state.userAffil,
            userPart: this.state.userPart,
            userJob: this.state.userJob,
            userEmail: this.state.userEmail,
            userPhone: this.state.userPhone,
            userLevel: this.props.user['레벨'],
            userAdmin: this.props.user['애드민'],
            userEngName: this.state.userEngName
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

    render(){
        const { classes } = this.props;
        
        return(
            <div className = {classes.div}>
                <Dialog open={this.state.open} onClose={this.handleFormClose} maxWidth={false}>
                    <DialogTitle>개인정보 변경</DialogTitle>
                    <DialogContent className={classes.infoDiv}>
                        <Grid container justify="center" spacing={4} className={classes.infoGridContainer}>
                            <Grid item xs={6} className={classes.infoGrid}>
                                <TextField label="영문이름"
                                    value={this.state.userEngName? this.state.userEngName: ''} onChange={this.handleTextFieldChange('userEngName')} margin="normal">
                                </TextField>
                                <TextField label="면허번호"
                                    value={this.state.userNo? this.state.userNo: ''} onChange={this.handleTextFieldChange('userNo')} margin="normal">
                                </TextField>
                                <TextField label="소속"
                                    value={this.state.userAffil? this.state.userAffil: ''} onChange={this.handleTextFieldChange('userAffil')} margin="normal">
                                </TextField>
                                <TextField label="부서"
                                    value={this.state.userPart? this.state.userPart: ''} onChange={this.handleTextFieldChange('userPart')} margin="normal">
                                </TextField>
                            </Grid>
                            <Grid item xs={6} className={classes.infoGrid}>
                                <TextField label="직종"
                                    value={this.state.userJob? this.state.userJob: ''} onChange={this.handleTextFieldChange('userJob')} margin="normal">
                                </TextField>
                                <TextField label="이메일"
                                    value={this.state.userEmail? this.state.userEmail: ''} onChange={this.handleTextFieldChange('userEmail')} margin="normal">
                                </TextField>
                                <TextField label="전화번호"
                                    value={this.state.userPhone? this.state.userPhone: ''} onChange={this.handleTextFieldChange('userPhone')} margin="normal">
                                </TextField>
                                <PasswordChange user={this.props.user}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.tooltipMes} placement="top">
                            <Button variant="contained" color="primary" onClick={this.handleInformationUpdate}>
                                변경
                            </Button>
                        </Tooltip>
                        <Button variant="contained" color="secondary" onClick={this.handleFormClose}>
                            취소
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleFormOpen}>
                    <HowToReg className={classes.icon} />
                    개인정보 변경
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(PersonalInfoChange);