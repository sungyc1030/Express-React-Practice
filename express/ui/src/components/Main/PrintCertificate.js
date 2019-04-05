import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Print } from '@material-ui/icons';

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    }
});

class PrintCertificate extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    handleClick = () => {
        console.log("certificate");
        this.props.show('Horizontal');
    }

    render(){
        const { classes } = this.props;

        var disableBtn = {}
        if(this.props.disableBtn){
            disableBtn.disabled = true;
        }
        
        return(
            <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleClick} {...disableBtn}>
                <Print className={classes.icon} />
                인증서 출력
            </Button>
        );
    }
}

export default withStyles(styles)(PrintCertificate);