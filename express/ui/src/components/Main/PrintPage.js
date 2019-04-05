import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import overlay from './overlay.module.css'
import posed from 'react-pose';

const styles = theme => ({
    
});

const Page = posed.div({
    visible: {
        applyAtStart: {display: 'flex'},
        opacity: 1
    },
    hidden: {
        applyAtEnd: { display: 'none'},
        opacity: 0
    }
})

class PrintPage extends Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        const { classes } = this.props;

        var printOriMain;
        var printOriSub;
        var levelClass;

        if(this.props.orientation === 'Horizontal'){
            if(this.props.level === 'Silver'){
                levelClass = overlay.silver
            }else if(this.props.level === 'Gold'){
                levelClass = overlay.gold
            }
            printOriMain = overlay.printHorizontal;
            printOriSub = [overlay.printSubHorizontal, levelClass].join(" ");
        }else if(this.props.orientation === 'Vertical'){
            printOriMain = overlay.printVertical;
            printOriSub = overlay.printSubVertical;
        }
        
        return(
            <Page className={overlay.overlay} pose={this.props.show? 'visible' : 'hidden' }>
                <div className={printOriMain}>
                    <div className = {printOriSub}>
                    </div>
                </div>
                <div className={overlay.btnDiv}>
                    <Button onClick={this.props.hide}>닫기</Button>
                </div>
            </Page>
        );
    }
}

export default withStyles(styles)(PrintPage);