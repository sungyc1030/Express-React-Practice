import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { TableCell, TableRow, MenuItem, TextField } from '@material-ui/core';
import { Clear, Edit } from '@material-ui/icons';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color
    },
    tableClassesCellInput: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color,
        padding: `${theme.spacing(1)}px`
    },
    tableClassesCell:{
        padding: `${theme.spacing(1)}px`
    },
    tableClassesCellSmall:{
        paddingLeft: '0px',
        paddingRight: '0px',
        width: '20px',
    },
    classInput: {
        width: '100px'
    },
    buttonNoPadding:{
        padding: '0px'
    }
});

const yesno = [
    '인정',
    '불인정'
];

class ClassDataRow extends Component{
    constructor(props){
        super(props)

        this.state = {
            role: '',
            attendance: '',
            id: 0,
            KAPA: '불인정',
            ARC: '불인정'
        }
    } 

    componentDidMount(){
        this.setState({
            role: this.props.data['역할']? this.props.data['역할']: '', 
            attendance: this.props.data['참가여부']? this.props.data['참가여부']: '',
            id: this.props.data['출결ID'],
            KAPA: this.props.data['KAPA'],
            ARC: this.props.data['ARC']
        });
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    deleteClassUser = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(window.confirm('정말로 삭제하시겠습니까?')){
            this.queryDeleteClassUser()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.changeClass();
                    }
                }).catch(err => {
                    console.log(err);
                    alert('삭제에 실패하였습니다.');
                });
        }else{
            window.alert('취소되었습니다.');
        }
    }

    queryDeleteClassUser = async() => {
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

    updateClassUser = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.queryUpdateClassUser()
            .then(res => {
                if(res.mes === 'Success'){
                    this.props.changeClass();
                    //window.alert('수정완료!');
                }
            }).catch(err => {
                console.log(err);
                window.alert('수정에 실패하였습니다.');
            });
    }

    queryUpdateClassUser = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var id = this.state.id;
        var data = JSON.stringify({
            post: 'Update User Class',
            userID: this.props.data.User['유저ID'],
            classID: this.props.data['교육ID'],
            role: this.state.role,
            attendance: this.state.attendance,
            KAPA: this.state.KAPA,
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
            <TableRow key={this.props.data.User['유저ID']}>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['유저번호']}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['이름']}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['소속']? this.props.data.User['소속']: ''}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['직종']? this.props.data.User['직종']: ''}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Input
                        value={this.state.role}
                        onChange={this.handleTextFieldChange('role')}
                        className={classes.classInput}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Input
                        value={this.state.attendance}
                        onChange={this.handleTextFieldChange('attendance')}
                        className={classes.classInput}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <TextField label="KAPA인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.KAPA} onChange={this.handleTextFieldChange('KAPA')} margin="normal" variant="outlined">
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
                <TableCell className={classes.tableClassesCellSmall} align="center">
                    <Button className={classes.buttonNoPadding} onClick = {this.updateClassUser}>
                        <Edit />
                    </Button>
                </TableCell>
                <TableCell className={classes.tableClassesCellSmall} align="center">
                    <Button className={classes.buttonNoPadding} onClick = {this.deleteClassUser}>
                        <Clear />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default withStyles(styles)(ClassDataRow)