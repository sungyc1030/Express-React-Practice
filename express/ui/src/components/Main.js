import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';

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
    userCard: {
        height: '150px',
        verticalAlign: 'middle'
    },
    educationList: {
        height: '200px',
        verticalAlign: 'middle'
    },
    printCard: {
        height: '80px'
    },
    passwordCard: {
        height: '60px',
        marginBottom: '10px'
    }
})

class Main extends Component{
    constructor(props){
        super(props)

        this.state = {}
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container justify="center" item xs={12} spacing={32}>
                        <Grid item xs={5}>
                            <Paper className={`${classes.paper} ${classes.userCard}`}>유저정보</Paper>
                        </Grid>
                        <Grid container item xs={5}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper className={`${classes.paper} ${classes.passwordCard}`}>패스워드 변경</Paper>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper className={`${classes.paper} ${classes.printCard}`}>증서 인쇄</Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={10} spacing={32}>
                        <Grid item xs={12}>
                            <Paper className={`${classes.paper} ${classes.educationList}`}>교육 리스트</Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Main);