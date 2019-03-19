import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = theme => ({
    root: {flexGrow: 1}
});

class ClassData extends Component{
    constructor(props){
        super(props)

        this.state = {}
    } 

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        {this.props.class['교육ID']}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.props.class['교육명']}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(ClassData)