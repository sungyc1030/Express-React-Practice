import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';

const styles = theme => ({
    root: {flexGrow: 1},
    grid: { 
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        margin: `4% ${theme.spacing.unit * 2}px`
    },
    mainPaper: {
        width : '100%'
    },
    container:{
        margin: '0 auto',
        textAlign: 'center',
        width: '40vw'
    },
    loginField: {
        padding: '16px'
    },
    loginHeading: {
        padding: '16px'
    },
    loginButton: {
        padding: '16px'
    },
});

class Login extends Component{
    constructor(props){
        super(props)

        this.state = {
            error: "",
            username: "",
            password: ""
        };
    }

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleLogin = async(e) => {
        e.preventDefault();
        e.stopPropagation();

        //Input Check
        if (this.state.username === ""){
            
        }

        if (this.state.password === ""){

        }
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: 'Update user',
                username: this.state.username,
                password: this.state.password
            }) 
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        //Directly move into main page for now
        //this.props.login();
        //this.props.history.push("/");
    }

    render(){
        const {classes} = this.props;
        return(
            <div className = {classes.root}>
                <Grid container justify="center" spacing={32} className={classes.grid}>
                    <Grid container item justify="center" xs={10} spacing={32}>
                        <Card className={classes.container}>
                            <CardContent>
                                <h2 className = {classes.loginHeading}>로그인</h2>
                                {}
                                <div className = {classes.loginField}>
                                    <FormControl>
                                        <InputLabel htmlFor="login-name">ID</InputLabel>
                                        <Input 
                                            id="login-name" 
                                            value={this.state.username}
                                            onChange={this.handleTextFieldChange('username')}
                                        />
                                        <FormHelperText id="login-user-error"></FormHelperText>
                                    </FormControl>
                                </div>
                                <div className = {classes.loginField}>
                                    <FormControl>
                                        <InputLabel htmlFor="login-password">Password</InputLabel>
                                        <Input 
                                            id="login-password" 
                                            value={this.state.password}
                                            onChange={this.handleTextFieldChange('password')}
                                        />
                                        <FormHelperText id="login-password-error"></FormHelperText>
                                    </FormControl>
                                </div>
                                <div className={classes.loginButton}>
                                    <Button variant="contained" label="로그인" onClick={this.handleLogin} color="primary">
                                        로그인
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Login);