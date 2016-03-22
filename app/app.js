import React from 'react';
import { Router, Route, Link } from 'react-router'

import HeaderNav from './components/shared/header_nav.js';
import Hero from './components/shared/hero.js';


const heroImages = [
  { imageID: "407661", url:"http://digitalcollections.nypl.org/items/510d47da-93ab-a3d9-e040-e00a18064a99",title:"Manchester University robot."},
  { imageID: "2006656", 
  	url:"http://digitalcollections.nypl.org/items/9fa26d46-8f2c-b70d-e040-e00a1806315a",
  	title:"Photograph through center hallway of the stacks"
  },
  { imageID: "ps_mss_587", 
  	url:"http://digitalcollections.nypl.org/items/92e4e115-5804-1ce1-e040-e00a18063701",
  	title:"Sectional view of the seven tiers of stacks."
  },
  { imageID: "465344", 
  	url:"http://digitalcollections.nypl.org/items/510d47da-e908-a3d9-e040-e00a18064a99",
  	title:"Central building : switch board and meters, engine room."
  },
  
  
  
]


const App = React.createClass({

  
  render() {
    return (
      <div>
        <HeaderNav title="data.nypl" link=""/>

        <Hero textMiddleClass="homepage-hero-middleText" image={ heroImages } textUpper="NYPL Labs" textMiddle="data.nypl" textLower=""/>

          <div className="container">
            <div className="row">
              <div className="tweleve columns">
               	<div className="homepage-text-blurb">
               		This site is the public side of an ongoing data project at <a href="http://labs.nypl.org">NYPL Labs</a>. Feel free to explore but please keep in mind this site may break or go offline at anytime. While we are working towards persistent URIs for our resources we are not quite there yet, so please do not reuse any of the identifiers found on this site.
               		<br/><br/>
               		<div><Link to="/agents">Explore Agents</Link></div>
               		<div>Explore Terms (coming soon)</div>
               		<div><Link to="/resources">Explore Resources</Link></div>
               		</div>
              </div>
            </div>
          </div>

        


        
       

      </div>
    );
  },
});

export default App;
