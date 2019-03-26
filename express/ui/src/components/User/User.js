import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress, Typography } from '@material-ui/core';
import UserData from './UserData';
import AddUser from './AddUser'

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
            empty: false
        }
    }

    getData = async() => {
        const response = await fetch('/api/user');
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
    }

    addUser = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    this.setState({users: res, loaded: true});
                }
            }).catch(err => console.log(err));
    }

    deleteUser = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
                    this.setState({users: res, loaded: true});
                }
            }).catch(err => console.log(err));
    }

    updateUser = () => {
        this.getData()
            .then(res => {
                if(res.length === 0){
                    this.setState({loaded:true, empty:true});
                }else{
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
                        <AddUser addUser={this.addUser} />
                        <Typography>
                            존재하는 유저 데이터가 없습니다. 새로 추가해주시기 바랍니다.
                        </Typography>
                    </CardContent>
            }else{
                renderHelper = 
                    <CardContent>
                        <AddUser addUser={this.addUser}/>
                        {this.state.users.map((data, index) => (
                            <UserData user={data} key={data['유저번호']} deleteUser={this.deleteUser} updateUser={this.updateUser}/>
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
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className={classes.mainPaper}>
                            {renderHelper}
                        </Card> 
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(User);