import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import overlay from './overlay.module.css';
import overlayText from './overlayText.module.css';
import posed from 'react-pose';
import silver from './img/silverLevel.JPG';
import gold from './img/goldLevel.JPG';
import ed from './img/education.JPG'

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

    print = () => {
        //Little bit of a hack....
        //Remove @page style
        var prevStyle = document.getElementById('pageStyle');
        if(prevStyle){
            prevStyle.parentNode.removeChild(prevStyle);
        }

        //Adding @page style
        var newStyle = document.createElement('style');
        newStyle.setAttribute('id', 'pageStyle');
        
        var innerString;
        if(this.props.orientation === 'Horizontal'){
            innerString = '@page {size: landscape; margin: 0px}';
        }else if(this.props.orientation === 'Vertical'){
            innerString = '@page {size: portrait; margin: 0px}';
        }

        newStyle.innerHTML = innerString
        document.head.appendChild(newStyle);

        window.print();
    }

    render(){
        //const { classes } = this.props;

        var printOriMain;
        var printOriSub;
        var imgSrc;
        var alt;

        var cCertifiedDate = '';
        var cDocumentNo = '';
        var cName = '';
        var cIssuedDate = '';
        var cSignature1 = '';
        var cSignature2 = '';
        var eIssuedDate = '';
        var eJobNo = '';
        var eYear = '';
        var eAffil = '';
        var eName = '';
        var eTable = '';
        var eSignature = '';

        var today = new Date();
        var todayStr = today.getFullYear() + " - " + today.getMonth().toLocaleString(undefined, {minimumIntegerDigits: 2}) + " - " + today.getDay();

        if(this.props.orientation === 'Horizontal'){
            printOriMain = overlay.printHorizontal;
            printOriSub = overlay.printSubHorizontal;
            if(this.props.level === 'Silver'){
                //levelClass = overlay.silver
                imgSrc = silver;
                alt = "Silver"
            }else if(this.props.level === 'Gold'){
                //levelClass = overlay.gold
                imgSrc = gold;
                alt = "Gold";
            }
            cCertifiedDate = todayStr;
            cDocumentNo = today.getFullYear() + '001';
            cName = this.props.name;
            cIssuedDate = '발급일 : ' + todayStr;
            cSignature1 = '서명1';
            cSignature2 = '서명2';
        }else if(this.props.orientation === 'Vertical'){
            printOriMain = overlay.printVertical;
            printOriSub = overlay.printSubVertical;
            imgSrc = ed;
            alt = "Ed";
            eIssuedDate = '발급일 : ' + todayStr;
            eJobNo = this.props.job + "  " + this.props.userNo;
            eYear = today.getFullYear();
            eAffil = this.props.affil;
            eName = this.props.name;
            eTable = '테이블';
            eSignature = '이름';
        }

        return(
            <Page className={overlay.overlay} pose={this.props.show? 'visible' : 'hidden' }>
                <div className={printOriMain}>
                    <div className = {printOriSub}>
                        <img className={overlay.img} src={imgSrc} alt={alt} onClick={(e) => {console.log(e.clientX, e.clientY)}}/>
                    </div>
                </div>
                <div className={overlayText.variableText}>
                    <div className={overlayText.cCertifiedDate}>
                        {cCertifiedDate}
                    </div>
                    <div className={overlayText.cDocumentNo}>
                        {cDocumentNo}
                    </div>
                    <div className={overlayText.cName}>
                        {cName}
                    </div>
                    <div className={overlayText.cIssuedDate}>
                        {cIssuedDate}
                    </div>
                    <div className={overlayText.cSignature1}>
                        {cSignature1}
                    </div>
                    <div className={overlayText.cSignature2}>
                        {cSignature2}
                    </div>
                    <div className={overlayText.eIssuedDate}>
                        {eIssuedDate}
                    </div>
                    <div className={overlayText.eJobNo}>
                        {eJobNo}
                    </div>
                    <div className={overlayText.eYear}>
                        {eYear}
                    </div>
                    <div className={overlayText.eAffil}>
                        {eAffil}
                    </div>
                    <div className={overlayText.eName}>
                        {eName}
                    </div>
                    <div className={overlayText.eTable}>
                        {eTable}
                    </div>
                    <div className={overlayText.eSignature}>
                        {eSignature}
                    </div>
                </div>
                <div className={overlay.btnDiv}>
                    <Button onClick={this.print}>인쇄</Button>
                    <Button onClick={this.props.hide}>닫기</Button>
                </div>
            </Page>
        );
    }
}

export default withStyles(styles)(PrintPage);