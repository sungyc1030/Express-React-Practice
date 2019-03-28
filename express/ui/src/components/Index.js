import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Routes from './Route';
import Login from './Login/Login';
import PrivateRoute from './PrivateRoute';
import Error404 from './Error404';

class Index extends Component{
    constructor(props){
        super(props)
        
        this.state = {
            isAuth: false
        }
    }

    loggedIn = () => {
        this.setState({isAuth: true});
    }

    loggedOut = () => {
        this.setState({isAuth: false});
    }

    render(){
        var renderHelper = Routes.map((prop, index) => (
            <PrivateRoute exact auth={this.state.isAuth} 
                path={prop.path} component={prop.component} key={prop.name} logout={this.loggedOut}/>
        ));

        return(
            <Router>
                <Switch>
                    {renderHelper}
                    <Route exact path={'/login'} key={'login'}
                        render = {(props) => <Login {...props} login={this.loggedIn}/>}
                    />
                    <Route component={Error404} />      
                </Switch>
            </Router>
        )
    }
}

export default Index;