import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, /*Fab,*/ Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { Tooltip, Typography, InputAdornment } from '@material-ui/core';
//import { Add } from '@material-ui/icons';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
    },
    fab:{
        margin: `${theme.spacing(1)}px`
    },
    classListTop: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginBottom: `${theme.spacing(2)}px`
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100px',
        color: theme.color
    }
});

/*const yesno = [
    '인정',
    '불인정'
];*/

class AddClass extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            className: '',
            classDate: '',
            classFee: 0,
            //classKAPA: '불인정',
            //classARC: '불인정',
            tooltipOpen: false,
            tooltipMes: '교육명은 필수사항입니다.'
        };
    };

    postData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            post: 'Add class',
            className: this.state.className,
            classDate: this.state.classDate,
            classFee: this.state.classFee,
            //classKAPA: (this.state.classKAPA === '인정')? 1:0,
            //classARC: (this.state.classARC === '인정')? 1:0
        });
        if(token !== null){
            response = await fetch('/api/class',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/class',{
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
 
    handleNewClass = () => {
        if(this.state.className === ''){
            this.setState({tooltipOpen: true});
        }else{
            this.setState({tooltipOpen: false});

            this.postData()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.addClass();
                        this.handleFormClose();
                    }else{
                        this.setState({tooltipOpen: true, tooltipMes: '서버와의 연결 문제로 교육등록에 실패했습니다.'});
                    }
                }).catch(err => console.log(err));
        }
    };

    handleFormOpen = () => {
        this.setState({ open: true});
    };

    handleFormClose = () => {
        this.setState({ open: false});
    };

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    dialogEnter = () =>{
        this.setState({
            className: '',
            classDate: '',
            classFee: 0,
            //classKAPA: '불인정',
            //classARC: '불인정',
            tooltipOpen: false,
            tooltipMes: '교육명은 필수사항입니다.'
        });
    }

    render(){
        const {classes} = this.props;
        return(
            <div>
                {/*<div className={classes.classListTop}>
                    <Fab color="primary" aria-label="Add" className={classes.fab} size="small" onClick={this.handleFormOpen}>
                        <Add />
                    </Fab>
                </div>*/}
                <Button className={classes.fab} onClick={this.handleFormOpen} color="primary" variant="contained">
                    <Typography variant="button">
                        새로운교육
                    </Typography>
                </Button>
                <Dialog open={this.state.open} onClose={this.handleFormClose} onEnter={this.dialogEnter} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">신규교육생성</DialogTitle>
                    <DialogContent>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.className} onChange={this.handleTextFieldChange('className')} margin="normal" variant="outlined" />
                        <TextField label="교육일" className = {classes.textField} 
                            value={this.state.classDate} onChange={this.handleTextFieldChange('classDate')} margin="normal" variant="outlined" />
                        <TextField label="교육비" className = {classes.textField} 
                            value={this.state.classFee} onChange={this.handleTextFieldChange('classFee')} margin="normal" variant="outlined" 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                            }}
                            />
                        {/*<TextField label="KAPA인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.classKAPA} onChange={this.handleTextFieldChange('classKAPA')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="ARC인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.classARC} onChange={this.handleTextFieldChange('classARC')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                            </TextField>*/}
                    </DialogContent>
                    <DialogActions>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.tooltipMes} placement="left">
                            <Button variant="contained" color="primary" onClick={this.handleNewClass}>
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

export default withStyles(styles)(AddClass)