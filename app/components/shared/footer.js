import React from 'react';
import { Router, Route, Link } from 'react-router';

import Data from '../shared/data.js';



const Footer = React.createClass({
  render() {


    return (
      <nav>
        <div className="container">
          <div className="row header">
            <div className="twelve columns footer">


            
                <Data></Data>
            </div>
        </div>
        </div>
      </nav>
      


    );
  }
});

export default Footer;
