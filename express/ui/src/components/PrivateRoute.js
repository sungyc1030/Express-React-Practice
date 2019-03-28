import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({component: Component, auth, logout, ...rest }) => (
    <Route {...rest}
        render = {props => (auth === true ? <Component {...props} logout={logout} /> 
            :
            <Redirect to="/login" />
            )}
    />
);

export default withRouter(PrivateRoute);