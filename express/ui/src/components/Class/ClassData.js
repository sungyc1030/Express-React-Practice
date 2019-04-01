import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions } from '@material-ui/core';
import { TextField, Typography, MenuItem, Button, Divider, Tooltip } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { DeleteForever, Clear } from '@material-ui/icons';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: theme.color,
        flexBasis: '18%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100px',
        color: theme.color
    },
    panelBody:{
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    panelHeader:{
        flexBasis: '80%'
    },
    tableClasses:{
        overflowY: 'auto',
        maxHeight: '20vh',
        fontSize: '10px'
    },
    tableClassesCell:{
        padding: `${theme.spacing.unit}px`
    },
    divider:{
        flexBasis: '100%',
        marginTop: '4px',
        marginBottom: '4px'
    }
});

const yesno = [
    '인정',
    '불인정'
];

class ClassData extends Component{
    constructor(props){
        super(props)

        this.state = {
            className: '',
            classDate: '',
            classCAS: '불인정',
            classARC: '불인정',
            tooltipOpen: false,
            allUsers: [],
            classID: 0,
            tooltipOpenUpdate: false,
        }
    } 

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    componentDidMount(){
        this.setState({
            className: this.props.class['교육명'],
            classDate: this.props.class['교육일'],
            classCAS: this.props.class['CAS'] ? '인정':'불인정',
            classARC: this.props.class['ARC'] ? '인정':'불인정',
            allUsers: this.props.class['UserClass'],
            classID: this.props.class['교육ID']
        });
    }

    deleteSelectedClass = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpen: false});

        if(window.confirm('정말로 삭제하시겠습니까?')){
            this.querydeleteSelectedClass()
                .then(res => {
                    if(res.mes === 'Success'){
                        this.props.deleteClass();
                        window.alert('삭제되었습니다.');
                    }else{
                        this.setState({tooltipOpen: true});
                        setTimeout(() => {
                            this.setState({tooltipOpen: false})
                        }, 1500);
                    }
                }).catch(err => {
                    this.setState({tooltipOpen: true});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                });
        }else{
            window.alert('취소되었습니다.');
        }

    }

    querydeleteSelectedClass = async() => {
        var id = this.state.classID;
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/class/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/class/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    updateSelectedClass = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({tooltipOpenUpdate: false});

        this.queryUpdateSelectedClass()
            .then(res => {
                if(res.mes === 'Success'){
                    this.props.updateClass();
                    window.alert('수정완료!');
                }else{
                    this.setState({tooltipOpenUpdate: true});
                    setTimeout(() => {
                        this.setState({tooltipOpenUpdate: false})
                    }, 1500);
                }
            }).catch(err => {
                this.setState({tooltipOpenUpdate: true});
                setTimeout(() => {
                    this.setState({tooltipOpenUpdate: false})
                }, 1500);
            });
    }

    queryUpdateSelectedClass = async() => {
        var id = this.state.classID;
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            post: 'Update class',
            className: this.state.className,
            classDate: this.state.classDate,
            classCAS: (this.state.classCAS === '인정')? 1:0,
            classARC: (this.state.classARC === '인정')? 1:0
        });
        if(token !== null){
            response = await fetch('/api/class/' + id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/class/' + id, {
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

        var renderHelper;

        if(this.state.allUsers.length === 0){
            renderHelper = 
                <Typography>
                    참가하고 있는 유저가 없습니다. 유저를 추가해주십시오.
                </Typography>
        }else{
            renderHelper = 
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableClassesCell} align="center">유저번호</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">유저이름</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">파트</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">직종</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">역할</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">참가여부</TableCell>
                            <TableCell className={classes.tableClassesCell} align="center">삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.allUsers.map((row, index) => (
                            <TableRow key={row.User['유저ID']}>
                                <TableCell className={classes.tableClassesCell} align="center">{row.User['유저번호']}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">{row.User['이름']}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">{row.User['파트']? row.User['파트']: ''}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">{row.User['직종']? row.User['직종']: ''}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">{row['역할']? row['역할']: ''}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">{row['참가여부']? row['참가여부']: ''}</TableCell>
                                <TableCell className={classes.tableClassesCell} align="center">
                                    <Button disabled>
                                        <Clear />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        }

        return(
            <div className = {classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.panelHeader}>
                            {this.state.className}
                        </Typography>
                        <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                            title="삭제에 실패하였습니다." placement="left">
                            <Button onClick={this.deleteSelectedClass}>
                                <DeleteForever/>
                                <Typography>
                                    삭제
                                </Typography>
                            </Button>
                        </Tooltip>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelBody}>
                        <TextField label="이름" className = {classes.textField} 
                            value={this.state.className} onChange={this.handleTextFieldChange('className')} margin="normal" variant="outlined" />
                        <TextField label="수업일" className = {classes.textField} 
                            value={this.state.classDate} onChange={this.handleTextFieldChange('classDate')} margin="normal" variant="outlined" />
                        <TextField label="CAS인증" select className = {classes.textFieldSelect} SelectProps={{MenuProps: {className: classes.textFieldSelect}}}
                            value={this.state.classCAS} onChange={this.handleTextFieldChange('classCAS')} margin="normal" variant="outlined">
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
                        </TextField>
                        <Divider className = {classes.divider} />
                        {renderHelper}
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                        <Tooltip open={this.state.tooltipOpenUpdate} disableFocusListener disableHoverListener disableTouchListener
                            title="수정에 실패하였습니다." placement="left">
                            <Button size="small" variant="outlined" onClick={this.updateSelectedClass}>교육정보수정</Button>
                        </Tooltip>
                        <Button size="small" variant="outlined" disabled>유저추가</Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(ClassData)