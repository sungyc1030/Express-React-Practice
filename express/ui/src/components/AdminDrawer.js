import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, withRouter } from 'react-router-dom';
import Routes from './Route';

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

        switch(this.props.location.pathname){
            case '/':
                this.state.selectedIndex = 0;
                break;
            case '/user':
                this.state.selectedIndex = 1;
                break;
            case '/class':
                this.state.selectedIndex = 2;
                break;
            case '/standard':
                this.state.selectedIndex = 3;
                break;
            case '/csv':
                this.state.selectedIndex = 4;
                break;
            default:
                this.state.selectedIndex = 0;
        } 
    }

    toggleDrawer = (openState) => () => {
        this.setState({
            open: openState
        });
    };

    handleDrawerItemClick = (e, index) =>{
        this.setState({selectedIndex: index});
    };

    componentDidUpdate(prevProps){
        if (this.props.location.pathname !== prevProps.location.pathname){
            switch(this.props.location.pathname){
                case '/':
                    this.setState({selectedIndex: 0});
                    break;
                case '/user':
                    this.setState({selectedIndex: 1});
                    break;
                case '/class':
                    this.setState({selectedIndex: 2});
                    break;
                case '/standard':
                    this.setState({selectedIndex: 3});
                    break;
                case '/csv':
                    this.setState({selectedIndex: 4});
                    break;
                default:
                    this.setState({selectedIndex: 0});
            } 
        }
    }

    render(){
        const { classes } = this.props;
        const sideList = (
            <div className={classes.list}>
                <List>
                    {Routes.map((prop, index) => (
                        <Link to={prop.path} key={prop.name}>
                            <ListItem button key={prop.name} selected = {this.state.selectedIndex === index} onClick={e => this.handleDrawerItemClick(e, index)}>
                                <ListItemIcon>
                                    <prop.icon />
                                </ListItemIcon>
                                <ListItemText primary={prop.name} />
                            </ListItem>
                        </Link>
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

export default withRouter(withStyles(styles)(AdminDrawer));