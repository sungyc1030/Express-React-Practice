import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { TableCell, TableRow } from '@material-ui/core';
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
    }
});

class ClassDataRow extends Component{
    constructor(props){
        super(props)

        this.state = {
            role: '',
            attendance: '',
            id: 0
        }
    } 

    componentDidMount(){
        this.setState({
            role: this.props.data['역할']? this.props.data['역할']: '', 
            attendance: this.props.data['참가여부']? this.props.data['참가여부']: '',
            id: this.props.data['출결ID']
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
            attendance: this.state.attendance
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
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['파트']? this.props.data.User['파트']: ''}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">{this.props.data.User['직종']? this.props.data.User['직종']: ''}</TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Input
                        value={this.state.role}
                        onChange={this.handleTextFieldChange('role')}
                    />
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Input
                        value={this.state.attendance}
                        onChange={this.handleTextFieldChange('attendance')}
                    />
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Button onClick = {this.updateClassUser}>
                        <Edit />
                    </Button>
                </TableCell>
                <TableCell className={classes.tableClassesCell} align="center">
                    <Button onClick = {this.deleteClassUser}>
                        <Clear />
                    </Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default withStyles(styles)(ClassDataRow)