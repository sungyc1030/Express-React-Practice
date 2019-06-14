import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Radio, MenuItem } from '@material-ui/core';

const styles = theme => ({
    root: {flexGrow: 1},
    buttonMargin:{
        marginLeft: '4px',
        marginRight: '4px'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color
    },
    scrollTableHead:{
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        padding: `${theme.spacing(1)}px`
    },
    scrollTable:{
        maxHeight: '300px',
        overflow: 'auto'
    },
    tableClassesCell:{
        padding: `${theme.spacing(1)}px`
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100px',
        color: theme.color
    },
});

const yesno = [
    '인정',
    '불인정'
];

class AddClassUser extends Component{
    constructor(props){
        super(props)

        this.state = {
            open: false,
            tooltipOpen: false,
            role: '',
            attendance: '',
            KAPA: '불인정',
            ARC: '불인정',
            tooltipMes: '유저를 선택해주세요.',
            radioChecked: 0
        }
    }

    postData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        const data = JSON.stringify({
            post: 'Add userClass',
            userID: this.state.radioChecked,
            classID: this.props.data['교육ID'],
            role: this.state.role,
            attendance: this.state.attendance,
            KAPA: this.state.KAPA,
            ARC: this.state.ARC
        });
        if(token !== null){
            response = await fetch('/api/attendance',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/attendance',{
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

    handleNewClassUser = () => {
        if(this.state.radioChecked === 0){
            this.setState({tooltipOpen: true});
        }else{
            this.setState({tooltipOpen: false});

            this.postData()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.handleFormClose();
                        this.props.updateClass();
                    }else{
                        this.setState({tooltipOpen: true, tooltipMes: '서버와의 연결 문제로 출결상태추가에 실패했습니다.'});
                    }
                }).catch(err => console.log(err));
        }
    }

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

    handleRadioChange = (e) => {
        this.setState({radioChecked: Number(e.target.value)});
    };

    dialogEnter = () =>{
        if(this.props.classUser.length !== 0){
            this.setState({
                role: '',
                attendance: '',
                KAPA: '불인정',
                ARC: '불인정',
                tooltipMes: '유저를 선택해주세요.',
                radioChecked: Number(this.props.classUser[0]['유저ID'])
            });
        }else{
            this.setState({
                role: '',
                attendance: '',
                KAPA: '불인정',
                ARC: '불인정',
                tooltipMes: '유저를 선택해주세요.',
                radioChecked: 0
            });
        }
    }

    render(){
        const { classes } = this.props;

        var renderHelper;

        if(this.props.classUser.length === 0){
            renderHelper = 
                <Typography>
                    선택 할 수 있는 유저가 없습니다. 먼저 유저관리에서 유저를 추가해주세요.
                </Typography>
        }else{
            renderHelper = 
                <div>
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.scrollTableHead} align="center">선택</TableCell>
                                    <TableCell className={classes.scrollTableHead} align="center">면허번호</TableCell>
                                    <TableCell className={classes.scrollTableHead} align="center">이름</TableCell>
                                    <TableCell className={classes.scrollTableHead} align="center">소속</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </div>
                    <div className={classes.scrollTable}>
                        <Table>
                            <TableBody>
                                {this.props.classUser.map((us, index) => (
                                    <TableRow key={us['유저ID']}>
                                        <TableCell align="center" className={classes.tableClassesCell}>
                                            <Radio 
                                                checked={this.state.radioChecked === Number(us['유저ID'])}
                                                onChange={this.handleRadioChange}
                                                value={Number(us['유저ID'])}
                                                name= {"userRadiotable" + this.props.data['교육ID']}
                                                aria-label={us['유저ID']}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableClassesCell} align="center">{us['유저번호']}</TableCell>
                                        <TableCell className={classes.tableClassesCell} align="center">{us['이름']}</TableCell>
                                        <TableCell className={classes.tableClassesCell} align="center">{us['소속']}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
        }

        return(
            <div>
                <div>
                    <Button className={classes.buttonMargin} onClick={this.handleFormOpen} size="small" variant="outlined">출결상태추가</Button>
                </div>
                <Dialog open={this.state.open} onClose={this.handleFormClose} onEnter={this.dialogEnter}>
                    <DialogTitle>출결상태추가</DialogTitle>
                    <DialogContent>
                        {renderHelper}
                        <TextField label="역할" className = {classes.textField} 
                            value={this.state.role} onChange={this.handleTextFieldChange('role')} margin="normal" variant="outlined" />
                        <TextField label="참가여부" className = {classes.textField} 
                            value={this.state.attendance} onChange={this.handleTextFieldChange('attendance')} margin="normal" variant="outlined" />
                        <TextField label="KAPA인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.KAPA} onChange={this.handleTextFieldChange('KAPA')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="ARC인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.ARC} onChange={this.handleTextFieldChange('ARC')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title={this.state.tooltipMes} placement="left">
                            <Button variant="contained" color="primary" onClick={this.handleNewClassUser}>
                                추가
                            </Button>
                        </Tooltip>
                        <Button variant="contained" color="secondary" onClick={this.handleFormClose}>
                            취소
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(AddClassUser)