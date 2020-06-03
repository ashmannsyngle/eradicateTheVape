import React, { Component } from 'react';
export default class BackGroundImage extends Component {
  render() {
    let img = (
      <div className="hero-image" role="img" aria-label="man smoking a vape">
        <div className="hero-text">
          <h1>Lead a <span className="green">healthier</span> life.</h1>
          <h1>Deal with your <span className="red">addiction</span> here.</h1>
        </div>
      </div>
    );
    return img;
  }
}
