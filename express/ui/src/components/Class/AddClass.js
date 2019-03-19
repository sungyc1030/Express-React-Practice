import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@material-ui/core';
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
    classListTop: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginBottom: `${theme.spacing.unit * 2}px`
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    textFieldSelect: {
        width: '150px'
    }
});

const yesno = [
    '인정',
    '불인정'
];

class AddClass extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            className: '',
            classDate: '',
            classCAS: '불인정',
            classARC: '불인정'
        };
    };
 
    handleNewClass = () => {
        console.log("since there is no input, do this for now");

        this.handleFormClose();
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

    render(){
        const {classes} = this.props;
        return(
            <div>
                <div className={classes.classListTop}>
                <Fab color="primary" aria-label="Add" className={classes.fab} size="small" onClick={this.handleFormOpen}>
                    <Add />
                </Fab>
                </div>
                <Dialog open={this.state.open} onClose={this.handleFormClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">신규교육생성</DialogTitle>
                    <DialogContent>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.className} onChange={this.handleTextFieldChange('className')} margin="normal" variant="outlined" />
                        <TextField label="수업일" className = {classes.textField} 
                            value={this.state.classDate} onChange={this.handleTextFieldChange('classDate')} margin="normal" variant="outlined" />
                        <TextField label="CAS인증" select className = {classes.textField} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.classCAS} onChange={this.handleTextFieldChange('classCAS')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="ARC인증" select className = {classes.textField} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.classARC} onChange={this.handleTextFieldChange('classARC')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleNewUser}>
                            생성
                        </Button>
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