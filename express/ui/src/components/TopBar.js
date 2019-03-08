import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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

    render(){
        return(
            <div className="root">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className="menuButton" color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className="grow">
                            Title
                        </Typography>
                        <Button color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(TopBar)