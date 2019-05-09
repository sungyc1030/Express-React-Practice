import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Avatar, CircularProgress, Button, Typography } from '@material-ui/core';
import { NoteAdd, AddCircle } from '@material-ui/icons';
import { brown } from '@material-ui/core/colors'
import TopBar from '../TopBar';
import Papa from 'papaparse'

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        margin: `4% ${theme.spacing.unit * 2}px`
    },
    mainPaper: {
        width : '100%'
    },    
    progress: {
        margin: `${theme.spacing.unit * 2}px`
    },
    inputFile: {
        display: 'none'
    },
    divFile: {
        display: 'flex',
    },
    csvStatus: {
        display: 'flex',
        marginLeft: '15px',
        alignItems: 'center'
    }
});

class Config extends Component{
    constructor(props){
        super(props)

        this.state = {
            loaded: true,
            status: '.csv 파일을 업로드해주세요. 다른 형식의 파일은 읽을 수 없습니다.',
        }
    }

    queryCSV = async(csv) => {
        var token = localStorage.getItem('jwt');
        var response;
        var data = JSON.stringify({
            post: 'Add class',
            data: csv
        });
        if(token !== null){
            response = await fetch('/api/config/csv',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: data
            });
        }else{
            response = await fetch('/api/config/csv',{
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

    handleFileUpload = (e) => {
        let file = e.target.files[0];
        this.setState({loaded: false});

        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    console.log(results);
                    this.queryCSV(results)
                        .then(res => {
                            if(res.mes === 'Success'){
                                this.setState({loaded: true, status: 'CSV갔다'});
                            }else{
                                this.setState({loaded: true, status: 'CSV못갔다'});
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    this.setState({loaded:true});
                },
                error: (e) => {
                    console.log(e);
                }
            });
        }
    }

    render(){
        const {classes} = this.props;

        var renderHelper = <CardContent>
                {this.state.loaded ? 
                    <div className={classes.divFile}>
                        <input accept=".csv" type="file" id="fileButton" className={classes.inputFile} onChange={this.handleFileUpload}/>
                        <label htmlFor="fileButton">
                            <Button variant="contained" color="primary" className = {classes.button} component="span">
                                <AddCircle className={classes.icon} />
                                CSV업로드
                            </Button>
                        </label>
                        <div className={classes.csvStatus}>
                            <Typography>
                                {this.state.status}
                            </Typography>
                        </div>
                    </div>
                    :
                    <CircularProgress className = {classes.progress}/>
                }
            </CardContent>;

        return(
            <div className = {classes.root}>
                <TopBar logout={this.props.logout} admin={this.props.admin}/>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className = {classes.mainPaper}>
                            <CardHeader
                                avatar = {
                                    <Avatar style={{backgroundColor: brown[500]}}>
                                        <NoteAdd />
                                    </Avatar>
                                }
                                title="CSV업로드"
                            />
                            {renderHelper}
                        </Card>    
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Config);