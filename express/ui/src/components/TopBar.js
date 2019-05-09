import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
//import MenuIcon from '@material-ui/icons/Menu';
import AdminDrawer from './AdminDrawer';

const styles = {
    root: {flexGrow: 1},
    grow: {flexGrow: 1},
    menuButton: {marginLeft:-12, marginRight: 20}
}

class TopBar extends Component{
    constructor(props){
        super(props)

        this.state = {

        }
    }

    handleLogout = e => {
        e.preventDefault();
        e.stopPropagation();

        //Directly move into main page for now
        this.props.logout();
    }

    render(){
        const {classes} = this.props;
        return(
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        {this.props.admin === "관리자" && <AdminDrawer />}
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            부정맥전문기술인회
                        </Typography>
                        <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(TopBar)