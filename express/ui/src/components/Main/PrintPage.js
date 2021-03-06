import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import overlay from './overlay.module.css';
import overlayText from './overlayText.module.css';
import posed from 'react-pose';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import silver from './img/silverLevel.JPG';
import gold from './img/goldLevel.JPG';
import ed from './img/education.JPG';
import { grey } from '@material-ui/core/colors'
import 기술인회서명 from './img/기술인회회장.png'
import 학회회장서명 from './img/학회회장.png'
import receipt from './img/영수증.JPG'

/*const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];*/

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

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: grey[300],
      color: theme.palette.common.black,
      padding: `${theme.spacing(1)}px`,
      fontSize: 14,
      border: '1px solid black'
    },
    body: {
      fontSize: 14,
      padding: `${theme.spacing(1)}px`,
      border: '1px solid black'
    },
  }))(TableCell);

class PrintPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            학회: '',
            기술인회: ''
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

    componentDidMount = () => {
        this.loadConfig()
    }

    loadConfig = () => {
        this.queryConfig()
            .then((res) => {
                this.setState({기술인회: res.기술인회, 학회: res.학회});
            }).catch(err => console.log(err));
    }

    queryConfig = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        if(token !== null){
            response = await fetch('/api/config', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
        }else{
            response = await fetch('/api/config');
        }
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    render(){
        const { classes } = this.props;

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
        var cLevel = '';
        var cLevelSub = '';
        var cLevelSubClass;
        var cLevelClass;
        var eIssuedDate = '';
        var eJobNo = '';
        var eYear = '';
        var eAffil = '';
        var eName = '';
        var eSignature = '';

        var rClassName = '';
        var rAffil = '';
        var rName = '';
        var rPrice = '';
        var rDate = '';

        var rClassHeader = '';
        var rAffilClass = 'rAffil1';
        var rNameClass = 'rName1';
        var rClassNameClass = 'rClassName1';
        //var rClassNameTextClass = 'rClassNameText1';

        var imgClass;
        var renderHelper = '';

        var today = new Date();
        var todayStr = today.getFullYear() + "-" + (today.getMonth() + 1).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "-" + 
            today.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2});
        //var todayStrEng = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

        if(this.props.receipt){
            printOriMain = overlay.printVertical;
            printOriSub = overlay.printSubVertical;
            imgSrc = receipt;
            imgClass = 'imgReceipt';
            rClassHeader = '교육명 : ';
            rClassName = this.props.receiptClass.교육명;
            /*if(rClassName.length > 10){
                rAffilClass = 'rAffil2';
                rNameClass = 'rName2';
                rClassNameClass = 'rClassName2';
                rClassNameTextClass = 'rClassNameText2';
            }else{*/
                rAffilClass = 'rAffil1';
                rNameClass = 'rName1';
                rClassNameClass = 'rClassName1';
                //rClassNameTextClass = 'rClassNameText1';
            //}
            rAffil = '소 속 : ' + this.props.affil;
            rName = '성 명 : ' + this.props.name;
            let priceFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'KRW'
              });
            rPrice = priceFormatter.format(this.props.receiptClass.교육비);
            rDate = this.props.receiptClass.교육일;

        }else if(this.props.orientation === 'Horizontal'){
            printOriMain = overlay.printHorizontal;
            printOriSub = overlay.printSubHorizontal;
            imgClass = 'img';
            if(this.props.level === 'Silver' || this.props.level === 'Silver+1' || this.props.level === 'Silver+2'){
                //levelClass = overlay.silver
                imgSrc = silver;
                alt = "Silver";
                cLevel = 'Silver';
                cLevelClass = 'cSilver';
                cLevelSubClass = 'cLevelSubSilver'
            }else if(this.props.level === 'Gold'){
                //levelClass = overlay.gold
                imgSrc = gold;
                alt = "Gold";
                cLevel = 'Gold';
                cLevelClass = 'cGold';
                cLevelSubClass = 'cLevelSubGold'
            }
            cLevelSub = 'Level';
            cCertifiedDate = "Issued :  " + this.props.issue; //todayStrEng;
            cDocumentNo = "Certificate # :  " + this.props.certification; //today.getFullYear() + '001';
            cName = this.props.engName;
            cIssuedDate = '출력일 : ' + todayStr;
            cSignature1 = <div className = {classes.signature}>
                    <img src={기술인회서명} alt='기술인회서명' className={classes.signatureImg}/>
                </div>
            cSignature2 = <div className = {classes.signature}>
                    <img src={학회회장서명} alt='학회서명' className={classes.signatureImg}/>
                </div>
            //cSignature1 = '서명1';
            //cSignature2 = '서명2';
        }else if(this.props.orientation === 'Vertical'){
            printOriMain = overlay.printVertical;
            printOriSub = overlay.printSubVertical;
            imgSrc = ed;
            imgClass = 'img';
            alt = "Ed";
            eIssuedDate = '출력일 : ' + todayStr;
            eJobNo = this.props.job + "  " + this.props.userNo;
            eYear = today.getFullYear();
            eAffil = this.props.affil;
            eName = this.props.name;
            eSignature = this.state.기술인회;

            renderHelper = 
                (this.props.userClass.length === 0 ?
                    <Typography>
                        존재하는 교육이 없습니다. 애초에 이 전에 버튼등등 막아놓은게 많은데 당신은 어떻게 여기까지 들어온거죠?
                    </Typography>
                    :
                    <Table className={classes.tablePrint}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell align="center" className={classes.firstCell}>교 육 명</CustomTableCell>
                                <CustomTableCell align="center">교 육 일</CustomTableCell>
                                <CustomTableCell align="center" className={classes.lastCell}>역 할</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.userClass.map((row, index) => {
                                var educationDate = new Date(row.Class.교육일);
                                var educationDateStr = educationDate.getFullYear() + '년 ' + (educationDate.getMonth() + 1) + '월 ' + educationDate.getDate() + '일';
                                var printStatus = false;

                                if(this.props.which === 2){
                                    if(this.props.startDate !== ""){
                                        var start = new Date(this.props.startDate);
                                        var end = new Date(this.props.endDate);
                                        if(educationDate >= start && educationDate <= end){
                                            printStatus = true;
                                        }
                                    }
                                }else if(this.props.which === 1){
                                    if(this.props.classYear !== 0){
                                        if(educationDate.getFullYear() === this.props.classYear){
                                            printStatus = true;
                                        }
                                    }
                                }

                                var comp = printStatus?
                                    <TableRow key={index}>
                                        <CustomTableCell align="center">{row.Class.교육명}</CustomTableCell>
                                        <CustomTableCell align="center">{educationDateStr}</CustomTableCell>
                                        <CustomTableCell align="center">{row.역할}</CustomTableCell>
                                    </TableRow>
                                    :
                                    null
                                return(
                                    comp
                                )
                            })}
                        </TableBody>
                    </Table>
                )
        }

        return(
            <Page className={overlay.overlay} pose={this.props.show? 'visible' : 'hidden' }>
                <div className={printOriMain}>
                    <div className = {printOriSub}>
                        <img className={overlay[imgClass]} src={imgSrc} alt={alt} onClick={(e) => {console.log(e.clientX, e.clientY)}}/>
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
                    <div className={overlayText.eIssuedDate}>
                        {eIssuedDate}
                    </div>
                    <div className={overlayText.eInfos}>
                        <div>
                            {eJobNo}
                        </div>
                        <div>
                            {eYear}
                        </div>
                        <div>
                            {eAffil}
                        </div>
                        <div>
                            {eName}
                        </div>
                    </div>
                    <div className={overlayText.eTable}>
                        {renderHelper}
                    </div>
                    <div className={overlayText.eSignature}>
                        {eSignature}
                    </div>
                    {/*<div className={overlayText[rClassNameClass]}>
                        {rClassHeader}
                    </div>
                    <div className={overlayText[rClassNameTextClass]}>
                        {rClassName}
                    </div>*/}
                    <div className = {overlayText[rClassNameClass]}>
                        {rClassHeader + ' ' + rClassName}
                    </div>
                    <div className={overlayText[rAffilClass]}>
                        {rAffil}
                    </div>
                    <div className={overlayText[rNameClass]}>
                        {rName}
                    </div>
                    <div className={overlayText.rPrice}>
                        {rPrice}
                    </div>
                    <div className={overlayText.rDate}>
                        {rDate}
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