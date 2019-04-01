import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Routes from './Route';
import Login from './Login/Login';
import PrivateRoute from './PrivateRoute';
import Error404 from './Error404';
import jwt_decode from 'jwt-decode';

class Index extends Component{
    constructor(props){
        super(props)
        
        this.tokenHolder = ""
        this.state = {
            isAuth: false,
            isAdmin: "사용자",
            userno: 0
        }
    }

    loggedIn = (userno, isAdmin) => {
        var token = localStorage.getItem('jwt');

        var decoded = jwt_decode(token);
        console.log(decoded);

        this.setState({isAuth: true, isAdmin: decoded.admin});
        this.props.history.push("/");
    }

    loggedOut = () => {
        localStorage.removeItem('jwt');
        this.setState({isAuth: false, isAdmin: "사용자"});
    }

    componentDidMount = () => {
        //Check if there is jwt
        var token = localStorage.getItem('jwt');
        if(token !== null){
            try{
                var decoded = jwt_decode(token);
                this.setState({isAuth: true, isAdmin: decoded.admin});
            }catch(err){
                //JWT corrupted
                localStorage.removeItem('jwt');
            }        
        }
    }

    componentDidUpdate(){
        //Check if there is jwt
        var token = localStorage.getItem('jwt');
        if(token !== null){
            if(token !== this.tokenHolder){
                try{
                    var decoded = jwt_decode(token);
                    this.setState({isAuth: true, isAdmin: decoded.admin});
                    this.tokenHolder = token;
                }catch(err){
                    //JWT corrupted
                    localStorage.removeItem('jwt');
                }
            }      
        }
    }

    render(){
        var renderHelper = Routes.map((prop, index) => (
            <PrivateRoute exact path={prop.path} auth={this.state.isAuth} 
                component={prop.component} key={prop.name} logout={this.loggedOut} admin={this.state.isAdmin} name={prop.name}/>
        ));

        return(
            <Switch>
                {renderHelper}
                <Route exact path={'/login'} key={'login'}
                    render = {(props) => (this.state.isAuth ? 
                    <Redirect to="/"/>
                    :
                    <Login {...props} login={this.loggedIn}/>)}
                />
                <Route component={Error404} />      
            </Switch>
        )
    }
}

export default withRouter(Index);