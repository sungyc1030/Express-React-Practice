import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({component: Component, auth, logout, admin, name, ...rest }) => (
    <Route {...rest}
        render = {props => (auth === true ? 
            (name === '내정보' ?
                <Component {...props} logout={logout} admin={admin}/>
                :
                (admin === '관리자' ?
                    <Component {...props} logout={logout} admin={admin}/>
                    :
                    <Redirect to="/" />
                )
            ) 
            :
            <Redirect to="/login" />
            )}
    />
);

export default withRouter(PrivateRoute);