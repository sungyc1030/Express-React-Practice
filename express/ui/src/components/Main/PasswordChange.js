import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    }
});

class PasswordChange extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    handleClick = () => {
        console.log("change password");
    }

    render(){
        const { classes } = this.props;
        
        return(
            <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleClick}>
                <Autorenew className={classes.icon} />
                패스워드 변경
            </Button>
        );
    }
}

export default withStyles(styles)(PasswordChange);