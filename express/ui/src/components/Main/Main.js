import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Avatar, Divider, Typography, Popover } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import TopBar from '../TopBar';
import { Person, Build, LibraryBooks, HelpOutline } from '@material-ui/icons';
import jwt_decode from 'jwt-decode';
import { blueGrey, indigo, amber } from '@material-ui/core/colors'
import PrintClasses from  './PrintClasses';
import PrintCertificate from './PrintCertificate';
import PrintReceipt from './PrintReceipt';
import PersonalInfoChange from './PersonalInfoChange'
import PrintPage from './PrintPage'
import 인증서발급기준 from './img/인증서발급기준.JPG'

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
    },
    paper: {
        padding: theme.spacing(1),
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
        margin: theme.spacing(1),
        padding: theme.spacing(1)
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
    gridItemLevel:{
        alignContent: 'center',
        alignItem: 'center',
        justifyContent: 'space-between'
    },
    userTypo: {
        paddingLeft: '5px'
    },
    tableClassesCell:{
        padding: `${theme.spacing(1)}px`
    },
    tableClassesCellReceipt:{
        padding: `${theme.spacing(1)}px`,
        width: '15%'
    },
    tableClassesCellHeader:{
        padding: `${theme.spacing(1)}px`,
        color: 'black',
        //fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    popover: {
        pointerEvents: 'none',
    },
    headerTypo: {
        fontWeight: 'bold',
        fontSize: ''
        //fontSize: '1.1rem'
    }
});

class Main extends Component{
    constructor(props){
        super(props)

        this.state = {
            user: {},
            userClass: [],
            printShow: false,
            printOrientation: 'Horizontal',
            classYear: 0,
            startDate: "",
            endDate: "",
            printWhich: 1, //1 is year, 2 is time range,
            anchorEl: null,
            receipt: false,
            receiptClass: null
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

    userUpdate = () => {
        this.getData()
            .then(res => {
                this.setState({user: res[0], userClass: res[0].UserClass});
            }).catch(err => console.log(err));
    }

    showPrintForm = (ori, year = 0, startDate = "", endDate = "", receipt = false, receiptID) => {
        console.log(receipt);
        if(receipt){
            let receiptClass;
            for(var i = 0; i < this.state.userClass.length; i++){
                let row = this.state.userClass[i];
                if(row.Class.교육ID === receiptID){
                    receiptClass = row.Class
                }
            }
            this.setState({printShow: true, printOrientation: ori, receiptClass: receiptClass, receipt: true});
        }else if(year === 0){
            if(startDate === "" || endDate === ""){
                this.setState({printShow: true, printOrientation: ori, receipt: false});
            }else{
                this.setState({printShow: true, printOrientation: ori, startDate: startDate, endDate: endDate, printWhich: 2, receipt: false});
            }
        }else{
            console.log("here");
            this.setState({printShow: true, printOrientation: ori, classYear: year, printWhich: 1, receipt: false});
        }
    }

    hidePrintForm = () => {
        this.setState({printShow: false});

        //Little bit of a hack....
        //Remove @page style
        var prevStyle = document.getElementById('pageStyle');
        if(prevStyle){
            prevStyle.parentNode.removeChild(prevStyle);
        }
    }

    handlePopoverOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handlePopoverClose = () => {
        this.setState({ anchorEl: null });
    };

    render(){
        const {classes} = this.props;
        const open = Boolean(this.state.anchorEl);

        var disableCertificate = {}
        if(this.state.user.레벨 === 'Normal'){
            disableCertificate.disableBtn = true;
        }

        var disableEducation = {}
        if(this.state.userClass.length === 0){
            disableEducation.disableBtn = true;
        }

        var levelDateEnd;
        if(this.state.user.LevelChangeDateEnd == null){
            levelDateEnd = "N/A"
        }else{
            levelDateEnd = new Date(this.state.user.LevelChangeDateEnd)
            levelDateEnd = [levelDateEnd.getFullYear(), ('0' + (levelDateEnd.getMonth() + 1)).slice(-2), ('0' + (levelDateEnd.getDate())).slice(-2)].join('-');
        }

        var ibhre;
        if(this.state.user.CCDS === 'Pass' && this.state.user.CEPS === 'Pass'){
            ibhre = 'CCDS, CEPS'
        }else if(this.state.user.CCDS === 'Pass'){
            ibhre = 'CCDS'
        }else if(this.state.user.CEPS === 'Pass'){
            ibhre = 'CEPS'
        }else{
            ibhre = '없음'
        }

        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={4} className={classes.grid}>
                    <Grid container justify="center" item xs={12} spacing={4} className={classes.gridTop}>
                        <Grid item xs={7}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar = {
                                        <Avatar style={{backgroundColor: blueGrey[500]}}>
                                            <Person />
                                        </Avatar>
                                    }
                                    title={this.state.user.유저번호 + " " + this.state.user.이름 + " " + this.state.user.영문이름}
                                    classes={{title: classes.headerTypo}}
                                />
                                <Divider className={classes.divider}/>
                                <CardContent style = {{height: '70%'}}>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"소속 : " + this.state.user.소속}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"부서 : " + this.state.user.부서}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"직종 : " + this.state.user.직종}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.divider}/>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"로그인ID : " + this.state.user.로그인ID}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItemLevel} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"레벨 : " + this.state.user.레벨}</Typography>
                                            <HelpOutline onMouseEnter={this.handlePopoverOpen} onMouseLeave={this.handlePopoverClose} aria-haspopup="true" aria-owns={open ? 
                                                    'levelInfoPopover': undefined} />
                                            <Popover
                                                id= "levelInfoPopover"
                                                className={classes.popover}
                                                open={open}
                                                anchorEl = {this.state.anchorEl}
                                                anchorOrigin = {{vertical: 'center', horizontal: 'right'}}
                                                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                                                onClose={this.handlePopoverClose}
                                                disableRestoreFocus    
                                            >
                                                <div>
                                                    <img src={인증서발급기준} alt={"인증서발급기준"} />
                                                </div>
                                            </Popover>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"자격 만료 : " + levelDateEnd}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.divider}/>
                                    <Grid container className={classes.gridRow}>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"TEL : " + this.state.user.전화번호}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem} style={{borderRight: '1px solid rgba(0,0,0,0.12)'}}>
                                            <Typography className={classes.userTypo}>{"Email : " + this.state.user.이메일}</Typography>
                                        </Grid>
                                        <Grid item container xs={4} className={classes.gridItem}>
                                            <Typography className={classes.userTypo}>{"IBHRE인증 : " + ibhre}</Typography>    
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
                                    classes={{title: classes.headerTypo}}
                                />
                                <Divider className={classes.divider}/>
                                <CardContent className={classes.cardBtn}>
                                    <PersonalInfoChange user={this.state.user} key={this.state.user.유저번호} updated={this.userUpdate}/>
                                    <PrintClasses show={this.showPrintForm} userClass={this.state.userClass} {...disableEducation}/>
                                    <PrintCertificate show={this.showPrintForm} {...disableCertificate}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container item xs={10} spacing={4}>
                        <Grid item xs={12} className={classes.gridClass}>
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar = {
                                        <Avatar style={{backgroundColor: indigo[500]}}>
                                            <LibraryBooks />
                                        </Avatar>
                                    }
                                    title="교육리스트"
                                    classes={{title: classes.headerTypo}}
                                />
                                <Divider className={classes.divider}/>
                                <CardContent style={{height: '80%'}}>
                                    <div style={{overflowY: 'auto', height: '100%'}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">교육명</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">교육일</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">KAPA인증</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">ARC인증</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">역할</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">참가여부</TableCell>
                                                    <TableCell className={classes.tableClassesCellHeader} align="center">영수증</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.userClass.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.교육명}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.Class.교육일}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.KAPA}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.ARC}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.역할}</TableCell>
                                                        <TableCell className={classes.tableClassesCell} align="center">{row.참가여부}</TableCell>
                                                        <TableCell className={classes.tableClassesCellReceipt} align="center">
                                                            <PrintReceipt show={this.showPrintForm} printID={row.Class.교육ID}/>
                                                        </TableCell>
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
                <PrintPage show={this.state.printShow} hide={this.hidePrintForm} orientation={this.state.printOrientation} engName={this.state.user.영문이름}
                    level={this.state.user.레벨} userClass={this.state.userClass} name={this.state.user.이름} job={this.state.user.직종} userNo={this.state.user.유저번호}
                    affil={this.state.user.소속} classYear={this.state.classYear} startDate={this.state.startDate} endDate={this.state.endDate} which={this.state.printWhich}
                    issue={this.state.user.IssuedDate} certification={this.state.user.CertificationNumber} receipt={this.state.receipt} receiptClass={this.state.receiptClass}
                    />
            </div>
        );
    }
}

export default withStyles(styles)(Main);