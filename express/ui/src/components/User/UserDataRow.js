import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { TableCell, TableRow, MenuItem, TextField } from '@material-ui/core';
import { Clear, Edit } from '@material-ui/icons';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.color
    },
    tableClassesCellInput: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.color,
        padding: `${theme.spacing.unit}px`
    },
    tableClassesCell:{
        padding: `${theme.spacing.unit}px`
    },
    textFieldSelect: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100px',
        color: theme.color
    },
    classInput: {
        width: '100px'
    },
});

const yesno = [
    '인정',
    '불인정'
];

class UserDataRow extends Component{
    constructor(props){
        super(props)

        this.state = {
            role: '',
            attendance: '',
            id: 0,
            CAS: '불인정',
            ARC: '불인정'
        }
    } 

    componentDidMount(){
        this.setState({
            role: this.props.data['역할']? this.props.data['역할']: '', 
            attendance: this.props.data['참가여부']? this.props.data['참가여부']: '',
            id: this.props.data['출결ID'],
            CAS: this.props.data['CAS'],
            ARC: this.props.data['ARC']
        });
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    deleteUserClass = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(window.confirm('정말로 삭제하시겠습니까?')){
            this.queryDeleteUserClass()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.changeUser();
                        window.alert('삭제되었습니다.');
                    }
                }).catch(err => {
                    console.log(err);
                    alert('삭제에 실패하였습니다.');
                });
        }else{
            window.alert('취소되었습니다.');
        }
    }

    queryDeleteUserClass = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var id = this.state.id;
        if(token !== null){
            response = await fetch('/api/attendance/' + id,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/attendance/' + id, {
                method: 'DELETE'
            });
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    updateUserClass = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.queryUpdateUserClass()
            .then(res => {
                if(res.mes === 'Success'){
                    this.props.changeUser();
                    //window.alert('수정완료!');
                }
            }).catch(err => {
                console.log(err);
                window.alert('수정에 실패하였습니다.');
            });
    }

    queryUpdateUserClass = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var id = this.state.id;
        var data = JSON.stringify({
            post: 'Update User Class',
            userID: this.props.userID,
            classID: this.props.data['교육ID'],
            role: this.state.role,
            attendance: this.state.attendance,
            CAS: this.state.CAS,
            ARC: this.state.ARC
        });
        if(token !== null){
            response = await fetch('/api/attendance/' + id,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/attendance/' + id, {
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

        return(
            <TableRow key={this.props.data['교육ID']}>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.Class['교육명']? this.props.data.Class['교육명']: ''}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.Class['교육일']? this.props.data.Class['교육일']: ''}</TableCell>
                <TableCell className={classes.tableClassesCellInput} align="center">
                    <Input
                        value={this.state.role}
                        onChange={this.handleTextFieldChange('role')}
                        className={classes.classInput}
                    />
                </TableCell>
                <TableCell className={classes.tableClassesCellInput} align="center">
                    <Input
                        value={this.state.attendance}
                        onChange={this.handleTextFieldChange('attendance')}
                        className={classes.classInput}
                    />
                </TableCell>
                {/*<TableCell className={classes.tableClassesCell} align="center">{this.props.data.Class['CAS']? '인정': '불인정'}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.Class['ARC']? '인정': '불인정'}</TableCell>*/}
                <TableCell className={classes.tableClassesCell} align="center">
                    <TextField label="CAS인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.CAS} onChange={this.handleTextFieldChange('CAS')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                    </TextField>
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <TextField label="ARC인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.ARC} onChange={this.handleTextFieldChange('ARC')} margin="normal" variant="outlined">
                            {yesno.map(option => (
                                <MenuItem key={option} value={option} className={classes.selectItem}>
                                    {option}
                                </MenuItem>
                            ))}
                    </TextField>
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Button onClick = {this.updateUserClass}>
                        <Edit />
                    </Button>
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Button onClick = {this.deleteUserClass}>
                        <Clear />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default withStyles(styles)(UserDataRow)