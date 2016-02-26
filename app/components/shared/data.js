import React from 'react';
import ReactDOM from 'react-dom'


const Data = React.createClass({

  componentDidMount(){

    setInterval(function(){this.render()}.bind(this),1000)



  },
  componentWillUpdate(){

    return true


  },

  toggleApiList(event){
    this.refs.databox.style.height="100px";
    this.refs.databox.style.overflowY="scroll";   

  },


  render() {

    var hist = JSON.parse(JSON.stringify(window.apiHistory))
    hist.reverse()
    return (
      <div className="">      
        <div className="dataicon" alt="Click to show API DATA" onClick={this.toggleApiList}></div>
        <div ref="databox" className="databox">
          
          {hist.map(x => {

            return (<code><a href={x.url}>{x.desc}</a></code>)

          })}


        </div>
      </div>
    );
  }
});

export default Data;
