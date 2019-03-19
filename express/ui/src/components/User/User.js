import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CircularProgress } from '@material-ui/core';
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
            loaded: false
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
                this.setState({users: res, loaded: true})
            }).catch(err => console.log(err));
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className={classes.mainPaper}>
                            {this.state.loaded ?
                            <CardContent>
                                <AddUser />
                                {this.state.users.map((data, index) => (
                                    <UserData user={data} key={data['유저번호']}/>
                                ))}
                            </CardContent>
                            : 
                            <CardContent className={classes.progressWrapper}>
                                <CircularProgress className = {classes.progress}/>
                            </CardContent>}
                        </Card> 
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(User);