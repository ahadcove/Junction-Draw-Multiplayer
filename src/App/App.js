import React from 'react';
import Routes from './Routes';
import ScrollToTop from './Utilities/ScrollToTop';

const App = () =>(
      <div className={"body"}>
         <ScrollToTop> 
            <Routes />
         </ScrollToTop> 
      </div>
    );

export default App;
