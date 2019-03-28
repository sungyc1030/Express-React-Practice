import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent } from '@material-ui/core';
import TopBar from '../TopBar';

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
    gridUser: {
        height: '32vh'
    },
    gridClass: {
        height: '44vh'
    },
    gridPass: {
        height: '13vh'
    },
    gridPrint: {
        height: '13vh'
    },
    verticalGrid:{
        justifyContent: 'space-between',
        height: '32vh'
    }
});

class Main extends Component{
    constructor(props){
        super(props)

        this.state = {}
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout}/>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container justify="center" item xs={12} spacing={32} className={classes.gridTop}>
                        <Grid item xs={7} className={classes.gridUser}>
                            <Card className={classes.card}>
                                <CardContent>
                                    유저정보
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid container item xs={3}>
                            <Grid container>
                                <Grid item xs={12} className={classes.gridPass}>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            패스워드리셋
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} className={classes.gridPrint}>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            증명서인쇄
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={10} spacing={32}>
                        <Grid item xs={12} className={classes.gridClass}>
                            <Card className={classes.card}>
                                <CardContent>
                                    교육리스트
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