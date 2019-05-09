import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress, Typography, CardHeader, Avatar, Divider } from '@material-ui/core';
import { Face } from '@material-ui/icons';
import { lime } from '@material-ui/core/colors'
import UserData from './UserData';
import AddUser from './AddUser'
import TopBar from '../TopBar';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        margin: `4% ${theme.spacing.unit * 2}px`,
    },
    mainPaper: {
        width : '100%',
        overflowY: 'auto',
        maxHeight: '80vh'
    },
    progress: {
        margin: `${theme.spacing.unit * 2}px`
    },
    progressWrapper: {
        display: 'flex',
        justifyContent: 'center'
    }
});

class User extends Component{
    constructor(props){
        super(props)

        this.state = {
            users: [],
            loaded: false,
            empty: false,
            userClass: []
        }
    }

    getData = async() => {
        //Force change 
        this.setState({loaded: false});
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user', {
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

    getClassData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/class/pure', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/class/pure');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    componentDidMount(){
        this.setState({loaded: false});
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    this.setState({users: res, loaded: true});
                }
            }).catch(err => console.log(err));
        this.getClassData()
            .then(res => {
                if(res.length !== 0){
                    this.setState({userClass: res, loaded: true});
                }
            }).catch(err => console.log(err));
    }

    changeUser = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    //Force change
                    //this.setState({loaded: false});
                    this.setState({users: res, loaded: true});
                }
            }).catch(err => console.log(err));
    }

    render(){
        const {classes} = this.props;

        var renderHelper;

        if(this.state.loaded){
            if(this.state.empty){
                renderHelper = 
                    <CardContent>
                        <AddUser addUser={this.changeUser} />
                        <Typography>
                            존재하는 유저 데이터가 없습니다. 새로 추가해주시기 바랍니다.
                        </Typography>
                    </CardContent>
            }else{
                renderHelper = 
                    <CardContent>
                        <AddUser addUser={this.changeUser}/>
                        {this.state.users.map((data, index) => (
                            <UserData user={data} key={data['유저ID']} deleteUser={this.changeUser} updateUser={this.changeUser} userClass={this.state.userClass}/>
                        ))}
                    </CardContent>
            }
        }else{
            renderHelper = 
                <CardContent className={classes.progressWrapper}>
                    <CircularProgress className = {classes.progress}/>
                </CardContent>
        }

        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className={classes.mainPaper}>
                            <CardHeader
                                avatar = {
                                    <Avatar style={{backgroundColor: lime[500]}}>
                                        <Face />
                                    </Avatar>
                                }
                                title="사용자 및 출결 관리"
                            />
                            <Divider/>
                            {renderHelper}
                        </Card> 
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(User);