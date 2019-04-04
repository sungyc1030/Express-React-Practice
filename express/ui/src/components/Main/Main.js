import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Button, Avatar, Divider, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import TopBar from '../TopBar';
import { Autorenew, Print, Description, Person, Build, LibraryBooks } from '@material-ui/icons';
import jwt_decode from 'jwt-decode';
import { blueGrey, indigo, amber } from '@material-ui/core/colors'

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        margin: `4% ${theme.spacing.unit * 2}px`
    },
    paper: {
        padding: theme.spacing.unit,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    card:{
        height: '100%'
    },
    gridTop: {
        height: '36vh'
    },
    gridClass: {
        height: '44vh'
    },
    verticalGrid:{
        justifyContent: 'space-between',
        height: '32vh'
    },
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    },
    cardBtn: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignContent: 'center',
        height: '70%'
    },
    divider:{
        flexBasis: '100%',
        marginTop: '4px',
        marginBottom: '4px'
    },
    gridRow: {
        height: '28%'
    },
    gridItem:{
        alignContent: 'center',
        alignItem: 'center'
    },
    userTypo: {
        paddingLeft: '5px'
    },
    tableClassesCell:{
        padding: `${theme.spacing.unit}px`
    },
});

class Main extends Component{
    constructor(props){
        super(props)

        this.state = {
            user: {},
            userClass: []
        }
    }

    getData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            var decoded = jwt_decode(token);
            response = await fetch('/api/user/' + decoded.userid, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    componentDidMount(){
        this.getData()
            .then(res => {
                this.setState({user: res[0], userClass: res[0].UserClass});
            }).catch(err => console.log(err));
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container justify="center" item xs={12} spacing={32} className={classes.gridTop}>
                        <Grid item xs={7}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar = {
                                        <Avatar style={{backgroundColor: blueGrey[500]}}>
                                            <Person />
                                        </Avatar>
                                    }
                                    title={this.state.user.유저번호 + " " + this.state.user.이름}
                                />
                                <Divider className={classes.divider}/>
                                <CardContent style = {{height: '70%'}}>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"소속 : " + this.state.user.소속}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"파트 : " + this.state.user.파트}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"직종 : " + this.state.user.직종}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.divider}/>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={6} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"TEL : " + this.state.user.전화번호}</Typography>
                                        </Grid>
                                        <Grid item container xs={6} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"Email : " + this.state.user.이메일}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.divider}/>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"로그인ID : " + this.state.user.로그인ID}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"레벨 : " + this.state.user.레벨}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"권한 : " + this.state.user.애드민}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={3}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar = {
                                        <Avatar style={{backgroundColor: amber[500]}}>
                                            <Build />
                                        </Avatar>
                                    }
                                    title="설정 및 인쇄"
                                />
                                <Divider className={classes.divider}/>
                                <CardContent className={classes.cardBtn}>
                                    <Button disabled variant="contained" color="primary" className = {classes.button}>
                                        <Autorenew className={classes.icon} />
                                        패스워드 변경
                                    </Button>
                                    <Button disabled variant="contained" color="primary" className = {classes.button}>
                                        <Description className={classes.icon} />
                                        교육 이수 현황 출력
                                    </Button>
                                    <Button disabled variant="contained" color="primary" className = {classes.button}>
                                        <Print className={classes.icon} />
                                        인증서 출력
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container item xs={10} spacing={32}>
                        <Grid item xs={12} className={classes.gridClass}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar = {
                                        <Avatar style={{backgroundColor: indigo[500]}}>
                                            <LibraryBooks />
                                        </Avatar>
                                    }
                                    title="교육리스트"
                                />
                                <Divider className={classes.divider}/>
                                <CardContent style={{height: '80%'}}>
                                    <div style={{overflowY: 'auto', height: '100%'}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableClassesCell} align="center">교육명</TableCell>
                                                    <TableCell className={classes.tableClassesCell} align="center">교육일</TableCell>
                                                    <TableCell className={classes.tableClassesCell} align="center">CAS인증</TableCell>
                                                    <TableCell className={classes.tableClassesCell} align="center">ARC인증</TableCell>
                                                    <TableCell className={classes.tableClassesCell} align="center">역할</TableCell>
                                                    <TableCell className={classes.tableClassesCell} align="center">참가여부</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.userClass.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.교육명}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.교육일}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.CAS? '인정':'불인정'}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.ARC? '인정':'불인정'}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.역할}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.참가여부}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Main);