import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress, Typography, CardHeader, Avatar, Divider } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { indigo } from '@material-ui/core/colors'
import AddClass from './AddClass';
import ClassData from './ClassData';
import TopBar from '../TopBar';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
    },
    mainPaper: {
        width : '100%',
        overflowY: 'auto',
        maxHeight: '80vh'
    },
    progress: {
        margin: `${theme.spacing(2)}px`
    },
    progressWrapper: {
        display: 'flex',
        justifyContent: 'center'
    }
});

class Class extends Component{
    constructor(props){
        super(props)

        this.state = {
            classes: [],
            loaded: false,
            empty: false,
            classUser: []
        }
    }

    getData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/class', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/class');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    getUserData = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/user/pure', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/user/pure');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    componentDidMount(){
        this.setState({loaded: false});
        let data;
        let user;
        this.getData()
            .then(res1 => {
                if(res1.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    //this.setState({classes: res, loaded: true});
                    data = res1;
                    this.getUserData()
                    .then(res2 => {
                        if(res2.length !== 0){
                            user = res2;
                            this.setState({classUser: user, loaded: true, classes: data});
                        }
                    }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
    }

    changeClass = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    //Force change
                    this.setState({loaded: false});
                    this.setState({classes: res, loaded: true});
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
                        <AddClass addClass = {this.changeClass}/>
                        <Typography>
                            존재하는 교육 데이터가 없습니다. 새로 추가해주시기 바랍니다.
                        </Typography>
                    </CardContent>
            }else{
                renderHelper = 
                    <CardContent>
                    <AddClass addClass = {this.changeClass}/>
                        {this.state.classes.map((data, index) => (
                            <ClassData class={data} key={data['교육ID']} deleteClass={this.changeClass} updateClass={this.changeClass} classUser={this.state.classUser}/>
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
                <Grid container justify="center" spacing={4} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={4}>
                        <Card className={classes.mainPaper}>
                            <CardHeader
                                avatar = {
                                    <Avatar style={{backgroundColor: indigo[500]}}>
                                        <Book />
                                    </Avatar>
                                }
                                title="교육 및 출결 관리"
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

export default withStyles(styles)(Class);