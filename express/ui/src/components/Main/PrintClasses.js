import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography } from '@material-ui/core';
import { Description } from '@material-ui/icons';
import { red } from '@material-ui/core/colors'

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        width: '100%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '200px',
        color: theme.color
    }
});

class PrintClasses extends Component{
    constructor(props){
        super(props);

        this.yearRange = [];

        this.state = {
            open: false,
            year: [],
            selectedYear: 0
        };
    }

    calculateYearRange = () => {
        var classArr = this.props.userClass;
        if(classArr.length === 0){
            return;
        }else{
            var yrange = [];
            var yset = new Set();
            for(var i = 0; i < classArr.length; i++){
                var single = classArr[i].Class;
                var date = new Date(single.교육일);
                var year = date.getFullYear();
                if(!isNaN(year)){
                    yset.add(year);
                }
            }
            for(let y of yset){
                yrange.push(y);
            }
            this.yearRange = yrange;
        }
    }

    handleFormOpen = () => {
        if(this.yearRange.length === 0){
            this.setState({ open: true })
        }else{
            this.setState({ open: true, year: this.yearRange, selectedYear: this.yearRange[0] });
        }
    };

    handleFormClose = () => {
        this.setState({ open: false});
    };

    componentDidUpdate(){
        this.calculateYearRange();
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleYearSelect = () => {
        this.props.show('Vertical', this.state.selectedYear);
        this.handleFormClose();
    }

    render(){
        const { classes } = this.props;

        var disableBtn = {}
        if(this.props.disableBtn){
            disableBtn.disabled = true;
        }
        
        return(
            <div style={{display:'flex'}}>
                <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleFormOpen} {...disableBtn}>
                    <Description className={classes.icon} />
                    교육 이수 현황 출력
                </Button>
                <Dialog open={this.state.open} onClose={this.handleFormClose} onEnter={this.dialogEnter}>
                    <DialogTitle>년도선택</DialogTitle>
                    <DialogContent>
                        {this.state.year.length === 0 ? 
                            <Typography color={red[500]}>수강한 교육이 존재하지 않습니다.</Typography>
                            :null
                        }
                        <TextField label="년도" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.selectedYear} onChange={this.handleTextFieldChange('selectedYear')} margin="normal" variant="outlined">
                            {this.state.year.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleYearSelect}>
                            확인
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

export default withStyles(styles)(PrintClasses);