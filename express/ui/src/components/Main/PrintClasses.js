import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography } from '@material-ui/core';
import { Description } from '@material-ui/icons';
//import { red } from '@material-ui/core/colors'

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '200px',
        color: theme.color
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '200px',
        color: theme.color
    },
    timeRange: {
        display: 'flex'
    }
});

class PrintClasses extends Component{
    constructor(props){
        super(props);

        this.yearRange = [];
        this.start = ""
        this.end = ""

        this.state = {
            open: false,
            year: [],
            selectedYear: 0,
            startDate: "",
            endDate: "" 
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
                try{
                    var date = new Date(single.교육일);
                    var year = date.getFullYear();
                    if(!isNaN(year)){
                        yset.add(year);
                    }
                    if(this.start === ""){
                        this.start = date;
                    }else if(this.start > date){
                        this.start = date;
                    }
                    if(this.end === ""){
                        this.end = date;
                    }else if(this.end < date){
                        this.end = date;
                    }
                }catch(err){

                }
            }
            for(let y of yset){
                yrange.push(y);
            }
            this.yearRange = yrange;
        }
    }

    numberFormat(n){
        return n > 9 ? "" + n: "0" + n
    }

    handleFormOpen = () => {
        if(this.yearRange.length === 0){
            this.setState({ open: true })
        }else{
            var start = this.start.getFullYear() + '-' + this.numberFormat(this.start.getMonth() + 1) + '-' + this.numberFormat(this.start.getDate());
            var end = this.end.getFullYear() + '-' + this.numberFormat(this.end.getMonth() + 1) + '-' + this.numberFormat(this.end.getDate());
            this.setState({ open: true, year: this.yearRange, selectedYear: this.yearRange[0], startDate: start, endDate: end });
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

    handleTimeSelect = () => {
        this.props.show('Vertical', 0, this.state.startDate, this.state.endDate);
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
                    <DialogTitle>기간선택</DialogTitle>
                    <DialogContent>
                        {this.state.year.length === 0 ? 
                            <Typography color="error">수강한 교육이 존재하지 않습니다.</Typography>
                            :
                            <div>
                                <TextField label="년도" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                                    value={this.state.selectedYear} onChange={this.handleTextFieldChange('selectedYear')} margin="normal" variant="outlined">
                                    {this.state.year.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <div className={classes.timeRange}>
                                    <TextField label="시작" className = {classes.textFieldSelect} value={this.state.startDate} onChange={this.handleTextFieldChange('startDate')}>
                                    </TextField>
                                    <TextField label="끝" className = {classes.textFieldSelect} value={this.state.endDate} onChange={this.handleTextFieldChange('endDate')}>
                                    </TextField>
                                </div>
                            </div>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleTimeSelect}>
                            기간으로 출력
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.handleYearSelect}>
                            년도로 출력
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