import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = theme => ({
    root: {flexGrow: 1}
});

class UserData extends Component{
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
                        {this.props.user['이름']}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.props.user['유저번호']}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(UserData)