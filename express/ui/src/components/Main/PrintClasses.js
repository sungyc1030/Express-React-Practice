import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Description } from '@material-ui/icons';

const styles = theme => ({
    icon: {
        marginRight: '2px'
    },
    button: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit
    }
});

class PrintClasses extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    handleClick = () => {
        console.log("classes");
        this.props.show('Vertical');
    }

    render(){
        const { classes } = this.props;
        
        return(
            <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleClick}>
                <Description className={classes.icon} />
                교육 이수 현황 출력
            </Button>
        );
    }
}

export default withStyles(styles)(PrintClasses);