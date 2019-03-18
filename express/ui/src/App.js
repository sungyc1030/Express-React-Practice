import React, { Component } from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { blue, indigo, red, cyan } from '@material-ui/core/colors';
import Index from './components/Index';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        secondary:{
            main: red[200]
        },
        primary:{
            main: cyan['A100']
        },
        tonalOffset: 0.2
        /*background: {
            default: blue[900]
        }*/
    },
    typography: {
        useNextVariants: true
    }
});

class App extends Component{
    constructor(props){
        super(props)
        
        this.state = {

        }
    }

    render(){
        return(
            <MuiThemeProvider theme = {theme}>
                <React.Fragment>
                    <CssBaseline />
                    <Index />
                </React.Fragment>
            </MuiThemeProvider>
        )
    }
}

export default App;