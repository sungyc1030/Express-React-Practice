import React, { Component } from 'react';
import TopBar from './TopBar';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Routes from './Route';

class Index extends Component{
    constructor(props){
        super(props)
        
        this.state = {

        }
    }

    render(){
        return(
            <Router>
                <div>
                    <TopBar />
                    {Routes.map((prop, index) => (
                        <Route exact path={prop.path} component={prop.component} key={prop.name}/>
                    ))}
                </div>
            </Router>
        )
    }

}

export default Index;