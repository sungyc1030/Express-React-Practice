import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Receipt } from '@material-ui/icons';

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    }
});

class PrintReceipt extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    handleClick = () => {
        this.props.show('Vertical', 0, "", "", true, this.props.printID);
    }

    render(){
        const { classes } = this.props;

        var disableBtn = {}
        if(this.props.disableBtn){
            disableBtn.disabled = true;
        }
        
        return(
            <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleClick} {...disableBtn}>
                <Receipt className={classes.icon} />
                영수증
            </Button>
        );
    }
}

export default withStyles(styles)(PrintReceipt);