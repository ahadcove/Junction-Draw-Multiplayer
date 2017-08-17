import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Home from './Containers/Home';
import Draw from './Containers/Draw';

const Routes = () =>(
        <Switch>
            <Route exact path='/home' component={Home} />
            <Route exact path='/draw' component={Draw} />
            {/* <Route path='/' render={()=>(
                <div>
                        <Nav />
                        <Route exact path='/' component={Home} />
                        <Route exact path='/todo-list' component={TodoList} />
                </div>
            )} /> */}
            <Redirect from='/**' to='/home'/>
        </Switch>
)

export default Routes;