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
    mainPaper: {
        width : '100%'
    }
});

class Config extends Component{
    constructor(props){
        super(props)

        this.state = {}
    } 

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className = {classes.mainPaper}>
                            <CardContent>
                                이수조건관리 (유저와 교육에 영향을 미치지는 않는다. 참고용)
                            </CardContent>
                        </Card>    
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Config);