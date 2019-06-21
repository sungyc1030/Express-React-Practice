import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { TextField, Typography, Button, Divider, Tooltip, Checkbox } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { DeleteForever } from '@material-ui/icons';
import ClassDataRow from './ClassDataRow';
import AddClassUser from './AddClassUser';

const styles = theme => ({
    root: {flexGrow: 1},
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: theme.color,
        flexBasis: '18%'
    },
    textFieldSelect: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100px',
        color: theme.color
    },
    panelBody:{
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    panelHeader:{
        flexBasis: '20%'
    },
    panelHeader2:{
        flexBasis: '60%'
    },
    tableClasses:{
        overflowY: 'auto',
        maxHeight: '20vh',
        fontSize: '10px'
    },
    tableClassesCell:{
        padding: `${theme.spacing(1)}px`
    },
    tableClassesCellSmall:{
        paddingLeft: '0px',
        paddingRight: '0px',
        width: '20px',
    },
    divider:{
        flexBasis: '100%',
        marginTop: '4px',
        marginBottom: '4px'
    },
    buttonMargin:{
        marginLeft: '4px',
        marginRight: '4px'
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
    headerCheckbox:{
        flexBasis: '8%'
    },
    header: {
        alignItems: 'center'
    },
    editButtons: {
        display: 'flex',
        flexDirection: 'row-reverse',
        flexBasis: '100%'
    }
});

class ClassData extends Component{
    constructor(props){
        super(props)

        this.state = {
            className: '',
            classDate: '',
            //classKAPA: '불인정',
            //classARC: '불인정',
            tooltipOpen: false,
            allUsers: [],
            classID: 0,
            tooltipOpenUpdate: false,
            checked: false,
            classFee: 0,
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
            //classKAPA: this.props.class['KAPA'] ? '인정':'불인정',
            //classARC: this.props.class['ARC'] ? '인정':'불인정',
            allUsers: this.props.class['UserClass'],
            classID: this.props.class['교육ID'],
            classFee: this.props.class['교육비'],
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
                    //this.props.updateClass();
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
            classFee: this.state.classFee
            //classKAPA: (this.state.classKAPA === '인정')? 1:0,
            //classARC: (this.state.classARC === '인정')? 1:0
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

    handleCheckboxClick = () => event => {
        event.stopPropagation();
        this.setState({checked: !this.state.checked});
        this.props.deleteChecks(this.state.classID);
    }

    createList = () => {
        const {classes} = this.props;

        var list;
        var result;
        var header;
        if(this.state.allUsers.length === 0){
            result = 
                <Typography>
                    참가하고 있는 유저가 없습니다. 유저를 추가해주십시오.
                </Typography>
        }else{
            header = 
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableClassesCell} align="center">면허번호</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">이름</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">소속</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">직종</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">역할</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">참가여부</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">KAPA</TableCell>
                        <TableCell className={classes.tableClassesCell} align="center">ARC</TableCell>
                        <TableCell className={classes.tableClassesCellSmall} align="center">수정</TableCell>
                        <TableCell className={classes.tableClassesCellSmall} align="center">삭제</TableCell>
                    </TableRow>
                </TableHead>
            let ct = 0
            list = this.state.allUsers.map((row, index) => {
                var status = <ClassDataRow data={row} key={row.User['유저ID']} changeClass={this.props.updateClass} classID={this.state.classID}/>
                var user = row.User;
                if(user['이름'].indexOf(this.props.searchName) === -1){
                    status = null;
                }
                if(user['유저번호'].indexOf(this.props.searchNo) === -1){
                    status = null;
                }
                if(user['소속'].indexOf(this.props.searchAffil) === -1){
                    status = null;
                }
                if(user['직종'].indexOf(this.props.searchJob) === -1){
                    status = null;
                }
                if(status != null){
                    ct += 1;
                }

                return status;
            });
            if(ct === 0){
                result = 
                    <Typography>
                        조회조건에 맞는 유저가 없습니다.
                    </Typography>
            }else{
                result =
                    <Table>
                        {header}
                        <TableBody>
                            {list}
                        </TableBody>
                    </Table>
            }
        }

        return result;
    }

    render(){
        const {classes} = this.props;

        var renderHelper = this.createList();

        /*if(this.state.allUsers.length === 0){
            renderHelper = 
                <Typography>
                    참가하고 있는 유저가 없습니다. 유저를 추가해주십시오.
                </Typography>
        }else{
            renderHelper = 
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableClassesCell} align="center">면허번호</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">이름</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">소속</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">직종</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">역할</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">참가여부</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">KAPA</TableCell>
                                    <TableCell className={classes.tableClassesCell} align="center">ARC</TableCell>
                                    <TableCell className={classes.tableClassesCellSmall} align="center">수정</TableCell>
                                    <TableCell className={classes.tableClassesCellSmall} align="center">삭제</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                            </TableBody>
                        </Table>

        }*/

        return(
            <div className = {classes.root}>
                <ExpansionPanel TransitionProps={{ unmountOnExit: true }} >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.header }}>
                        <div className={classes.headerCheckbox}>
                            <Checkbox 
                                checked={this.state.checked}
                                onClick={this.handleCheckboxClick()}
                                value="Checked"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                        </div>
                        <Typography className={classes.panelHeader}>
                            {this.state.className}
                        </Typography>
                        <Typography className={classes.panelHeader2}>
                            {this.state.classDate}
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
                        <TextField label="교육일" className = {classes.textField} type="date" InputLabelProps={{ shrink: true }}
                            value={this.state.classDate} onChange={this.handleTextFieldChange('classDate')} margin="normal" variant="outlined" />
                        <TextField label="교육비" className = {classes.textField}
                            value={this.state.classFee} onChange={this.handleTextFieldChange('classFee')} margin="normal" variant="outlined" />
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
                        <Divider className = {classes.divider} />
                        <div className = {classes.editButtons}>
                            <Tooltip open={this.state.tooltipOpenUpdate} disableFocusListener disableHoverListener disableTouchListener
                                title="수정에 실패하였습니다." placement="top">
                                <Button size="small" variant="outlined" onClick={this.updateSelectedClass}>교육정보수정</Button>
                            </Tooltip>
                        </div>
                        <Divider className = {classes.divider} />
                        {renderHelper}
                        <div className = {classes.editButtons}>
                            <AddClassUser data={this.props.class} classUser={this.props.classUser} updateClass={this.props.updateClass}/>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(ClassData)