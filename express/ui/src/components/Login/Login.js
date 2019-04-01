import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, FormControl, InputLabel, Input, FormHelperText, Button, Typography } from '@material-ui/core';

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
    }
});

class Login extends Component{
    constructor(props){
        super(props)

        this.state = {
            error: "",
            username: "",
            password: "",
            usernameErrorText: "",
            passwordErrorText: "",
            loginErrorText: ""
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
            this.setState({usernameErrorText: 'ID를 입력해주십시오'});
        }else{
            this.setState({usernameErrorText: ''});
        }

        if (this.state.password === ""){
            this.setState({passwordErrorText: '비밀번호를 입력해주십시오'});
        }else{
            this.setState({passwordErrorText: ''});
        }

        if(this.state.username === "" || this.state.password === ""){
            return;
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
        if (response.status !== 200){
            console.log(body.message);
            this.setState({loginErrorText: '로그인에 실패했습니다. ID와 비밀번호를 확인해주세요.'});
        }else{
            //console.log(body);
            this.setState({loginErrorText: ''});
            var token = body.token;
            localStorage.setItem("jwt", token);
            this.props.login();
            //this.props.history.push("/");
        }

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
                                <Typography color="error">{this.state.loginErrorText}</Typography>
                                <div className = {classes.loginField}>
                                    <FormControl>
                                        <InputLabel htmlFor="login-name">ID</InputLabel>
                                        <Input 
                                            id="login-name" 
                                            value={this.state.username}
                                            onChange={this.handleTextFieldChange('username')}
                                        />
                                        <FormHelperText id="login-user-error" color="error">{this.state.usernameErrorText}</FormHelperText>
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
                                        <FormHelperText id="login-password-error" color="error">{this.state.passwordErrorText}</FormHelperText>
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