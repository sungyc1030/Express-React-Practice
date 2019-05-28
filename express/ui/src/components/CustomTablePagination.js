import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core'
import { FirstPage, LastPage, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'

const styles = theme => ({
    root: {flexShrink: 0, 
        color: theme.palette.text.secondary
    },
});

class CustomTablePagination extends Component{
    constructor(props){
        super(props)

        this.state = {

        }
    }

    handleFirstPageButtonClick(event){
        this.props.onChangePage(event, 0);
    }

    handleBackButtonClick(event){
        this.props.onChangePage(event, this.props.page - 1);
    }

    handleNextButtonClick(event){
        this.props.onChangePage(event, this.props.page + 1);
    }

    handleLastPageButtonClick(event){
        this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / 5) - 1));
    }

    render(){
        const {classes} = this.props;

        return(
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={this.props.page === 0}
                    aria-label="First Page"
                >
                    <FirstPage />
                </IconButton>
                <IconButton onClick={this.handleBackButtonClick} disabled={this.props.page === 0} aria-label="Previous Page">
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={this.props.page >= Math.ceil(this.props.count / 5) - 1}
                    aria-label="Next Page"
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={this.props.page >= Math.ceil(this.props.count / 5) - 1}
                    aria-label="Last Page"
                >
                    <LastPage />
                </IconButton>
            </div>
        )
    }
}

export default withStyles(styles)(CustomTablePagination);
