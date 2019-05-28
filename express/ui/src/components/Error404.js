import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Button, Typography } from '@material-ui/core';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
    },
    container: {
        margin: '0 auto',
        textAlign: 'center',
        width: '20vw'
    },
    errorHeading: {
        padding: '20px'
    }
});

class Error extends Component{
    constructor(props){
        super(props)

        this.state = {

        }
    }

    gotoMainPage = () => {
        this.props.history.push('/');
    };

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <Grid container justify="center" spacing={4} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={4}>
                        <Card className={classes.container}>
                            <CardContent>
                                <Typography className={classes.errorHeading}>에러페이지</Typography>
                                <Button variant="contained" onClick={this.gotoMainPage} color="primary">메인페이지로</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default withStyles(styles)(Error);