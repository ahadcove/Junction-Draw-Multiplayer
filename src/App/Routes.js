import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Home from './Containers/Home';
import Draw from './Containers/Draw';

const Routes = () =>(
        <Switch>
            <Route exact path='/home' component={Home} />
            <Route exact path='/draw' component={Draw} />
            <Redirect from='/**' to='/home'/>
        </Switch>
)

export default Routes;