import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import overlay from './overlay.module.css';
import overlayText from './overlayText.module.css';
import posed from 'react-pose';
import silver from './img/silverLevel.JPG';
import gold from './img/goldLevel.JPG';
import 기술인회서명 from './img/기술인회회장.png'
import 학회회장서명 from './img/학회회장.png'

const styles = theme => ({
    tablePrint:{
        tableLayout: 'fixed'
    },
    signature:{
        width: '400px',
        height: '200px'
    },
    signatureImg:{
        maxWidth: '100%',
        maxHeight: '100%'
    },
    firstCell:{
        width: '50%'
    },
    lastCell:{
        width: '20%'
    }
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
});

class UserCertificate extends Component{
    constructor(props){
        super(props);

        this.state = {
            show: false,
            userEngName: '',
            userLevel: '',
            userIssuedDate: '',
            userCertificateNo: ''
        }
    }

    showCertificate = (userEngName, userLevel, userIssueDate, userCertificateNo) => {
        this.setState({show: true, userEngName: userEngName, userLevel: userLevel,userIssuedDate: userIssueDate, userCertificateNo: userCertificateNo});
    }

    hideCertificate = () => {
        this.setState({show: false});
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
        const {classes} = this.props;

        let imgSrc;
        let printOriMain = overlay.printHorizontal;
        let printOriSub = overlay.printSubHorizontal;
        let alt;
        let cLevel;
        let cLevelClass;
        let cLevelSubClass;
        //console.log(this.state);
        if(this.state.userLevel === 'Gold'){
            imgSrc = gold;
            alt = 'Gold';
            cLevel = 'Gold';
            cLevelClass = 'cGold';
            cLevelSubClass = 'cLevelSubGold'
        }else if(this.state.userLevel.indexOf('Silver') !== -1){
            imgSrc = silver;
            alt = 'Silver';
            cLevel = 'Silver';
            cLevelClass = 'cSilver';
            cLevelSubClass = 'cLevelSubSilver'
        }
        let today = new Date();
        let todayStr = today.getFullYear() + "-" + (today.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "-" + 
            today.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
        let cLevelSub = 'Level';
        let cCertifiedDate = "Issued :  " + this.state.userIssuedDate; //todayStrEng;
        let cDocumentNo = "Certificate # :  " + this.state.userCertificateNo; //today.getFullYear() + '001';
        let cName = this.state.userEngName;
        let cIssuedDate = '출력일 : ' + todayStr;
        let cSignature1 = <div className = {classes.signature}>
                <img src={기술인회서명} alt='기술인회서명' className={classes.signatureImg}/>
            </div>
        let cSignature2 = <div className = {classes.signature}>
                <img src={학회회장서명} alt='학회서명' className={classes.signatureImg}/>
            </div>

        return(
            <Page className={overlay.overlay} pose={this.state.show? 'visible' : 'hidden' }>
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
                    <div className={overlayText[cLevelClass]}>
                        {cLevel}
                    </div>
                    <div className={overlayText[cLevelSubClass]}>
                        {cLevelSub}
                    </div>
                </div>
                <div className={overlay.btnDiv}>
                    <Button onClick={this.print}>인쇄</Button>
                    <Button onClick={this.props.close}>닫기</Button>
                </div>
            </Page>
        );
    }
}

export default withStyles(styles)(UserCertificate);