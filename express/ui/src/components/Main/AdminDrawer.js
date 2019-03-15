import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Face } from '@material-ui/icons'

const styles = {
    menuButton: {marginLeft:-12, marginRight: 20},
    list: {width: 250}
}

class AdminDrawer extends Component{
    constructor(props){
        super(props)

        this.state = {
            open: false,
            selectedIndex: 0
        }
    }

    toggleDrawer = (openState) => () => {
        this.setState({
            open: openState
        });
    };

    handleDrawerItemClick = (e, index) =>{
        e.preventDefault();

        this.setState({selectedIndex: index});
    };

    render(){
        const { classes } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List>
                    {['내정보', '유저관리','교육관리','기준관리','이수조건관리'].map((text, index) => (
                        <ListItem button key={text} selected = {this.state.selectedIndex === index} onClick={e => this.handleDrawerItemClick(e, index)}>
                            <ListItemIcon>
                                <Face />
                            </ListItemIcon>
                             <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return(
            <div>
                <IconButton onClick={this.toggleDrawer(true)} className={classes.menuButton}>
                    <MenuIcon />
                </IconButton>
                <Drawer anchor="left" open={this.state.open} onClose={this.toggleDrawer(false)}>
                    <div tabIndex={0} role="button" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles)(AdminDrawer);