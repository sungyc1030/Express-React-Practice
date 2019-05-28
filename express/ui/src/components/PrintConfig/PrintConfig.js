import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, TextField, Button, CardActions, CardHeader, Avatar, Tooltip } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { teal } from '@material-ui/core/colors'
import TopBar from '../TopBar';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `4% ${theme.spacing(2)}px`
    },
    mainPaper: {
        width : '100%'
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    printConfigAction:{
        flexDirection: 'row-reverse'
    },
    printConfigContent: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'space-evenly'
    },
    printConfigText: {
        width: '20vw'
    }
});

class PrintConfig extends Component{
    constructor(props){
        super(props)

        this.state = {
            tech: '',
            ed: '',
            tooltipOpen: false,
            tooltipMes: '반영에 실패하였습니다.'
        }
    } 

    componentDidMount = () => {
        this.queryConfig()
            .then((res) => {
                this.setState({tech: res.기술인회, ed: res.학회})
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

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleUpdate = () => {
        this.setState({tooltipOpen: false});

        this.queryUpdateConfg()
            .then(res => {
                if(res.mes === 'Success'){
                    this.setState({tooltipOpen: true, tooltipMes: '반영에 성공하였습니다.'});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                }else{
                    this.setState({tooltipOpen: true, tooltipMes: '반영에 실패하였습니다.'});
                    setTimeout(() => {
                        this.setState({tooltipOpen: false})
                    }, 1500);
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({tooltipOpen: true, tooltipMes: '반영에 실패하였습니다.'});
                setTimeout(() => {
                    this.setState({tooltipOpen: false})
                }, 1500);
            })
    }

    queryUpdateConfg = async() => {
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            post: 'Change Config',
            tech: this.state.tech,
            ed: this.state.ed
        });

        if(token !== null){
            response = await fetch('/api/config', {
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               },
               body: data
            });
        }else{
            response = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
             });
        }

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={4} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={4}>
                        <Card className = {classes.mainPaper}>
                            <CardHeader
                                avatar = {
                                    <Avatar style={{backgroundColor: teal[500]}}>
                                        <Settings />
                                    </Avatar>
                                }
                                title="출력물 변수 설정"
                            />
                            <CardContent className = {classes.printConfigContent}>
                                <TextField label="기술인회 회장 성명" className = {classes.printConfigText}
                                    value={this.state.tech} onChange={this.handleTextFieldChange('tech')} margin="normal">

                                </TextField>
                                <TextField label="학회 회장 성명" className = {classes.printConfigText}
                                    value={this.state.ed} onChange={this.handleTextFieldChange('ed')} margin="normal">

                                </TextField>
                            </CardContent>
                            <CardActions className={classes.printConfigAction}>
                                <Tooltip open={this.state.tooltipOpen} disableFocusListener disableHoverListener disableTouchListener
                                        title={this.state.tooltipMes} placement="top">
                                    <Button variant="contained" color="primary" className = {classes.button} onClick={this.handleUpdate}>
                                        반영
                                    </Button>
                                </Tooltip>
                            </CardActions>
                        </Card>    
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(PrintConfig);