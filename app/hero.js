import React from 'react';

const Hero = React.createClass({

  componentWillMount(){

    this.setState( { heroImageStyle: {}})
    this.setState( { heroImageLink: ""})
    this.setState( { heroImageAlt: ""})
    this.setState( { maskStyle: {}})


  },
  componentWillUpdate(){




  },


  render() {

    var maskStyle = {}
    var textMiddleClass = "", textLowerClass = ""
    if (Array.isArray(this.props.image)){
      var random = this.props.image[Math.floor(Math.random()*this.props.image.length)]
      var heroImageStyle = { backgroundPositionX: '-30px', backgroundImage : "url(http://images.nypl.org/index.php?id="+random.imageID+"&t=w)", backgroundSize: "cover" } 
      var heroImageLink =  random.url 
      var heroImageAlt =  random.title 
    }else if (this.props.image){
      var heroImageStyle = { backgroundPositionX: 'center',  backgroundImage : `url(${this.props.image.url})`, backgroundSize: "cover" } 
    }else if (!this.props.image){
      maskStyle =  {display:"none"}
    }

    if (this.props.image) if (this.props.image.url === false) maskStyle =  {display:"none"}

  
    console.log(this.props,"<<<",maskStyle,this.props.image.url)

    if (this.props.textMiddleClass) textMiddleClass = this.props.textMiddleClass
    if (this.props.textLowerClass) textLowerClass = this.props.textLowerClass


    return (
      <div className="hero">      
        <div className="container">
          <div className="row">
            <div className="six columns hero-left">
              <div>{ this.props.textUpper }</div>
              <h2 className={textMiddleClass}>{ this.props.textMiddle }</h2>
              <div className={textLowerClass}>{ this.props.textLower }</div>
            </div>
            <div className="six columns hero-right">
                <div style={maskStyle} className="mask">
                  <a title={heroImageAlt} href={heroImageLink}>
                  <div alt={heroImageAlt} title={heroImageAlt}  style={heroImageStyle} className="billi-logo"> </div>
                  </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Hero;
