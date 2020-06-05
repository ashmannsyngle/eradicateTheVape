import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactDOM from 'react-dom'


class Marketplace extends Component {
  constructor(props) {
      super(props);
      this.state = {
          badges: [],
          userBadges: [],
          error: ''
      }
  }

  sendRequest = async (e) => {
      const response = await fetch(api.base + api.handlers.marketplace, {
          method: "GET",
          headers: new Headers({
            "Authorization": localStorage.getItem("Authorization")
        })
      });
      if (response.status >= 300) {
          const error = await response.text();
          this.setError(error);
          return;
      }
      const badgesResponse = await response.json();
      this.setState({
        badges: badgesResponse.map(badge => ({
          badgeID: badge.badgeID,
          cost: badge.cost,
          badgeName: badge.badgeName,
          badgeDescription: badge.badgeDescription,
          imgURL: badge.imgURL,
        }))
      });
  }

  sendRequestTwo = async (e) => {
    const response = await fetch(api.base + api.handlers.marketplaceBadges + e.badgeID, {
        method: "PATCH",
        headers: new Headers({
          "Authorization": localStorage.getItem("Authorization"),
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        this.setError(error);
        return;
    }
    alert("Badge successfully added to your profile!") 
  }

  sendRequestThree = async (e) => {
    const response = await fetch(api.base + api.handlers.marketplaceBadges + this.props.user.id, {
      method: "GET",
      headers: new Headers({
        "Authorization": localStorage.getItem("Authorization")
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        this.setError(error);
        return;
    }
    const badgesResponse = await response.json();
    if (badgesResponse != null) {
      this.setState({
        userBadges: badgesResponse.map(badge => ({
          badgeID: badge.badgeID,
          cost: badge.cost,
          badgeName: badge.badgeName,
          badgeDescription: badge.badgeDescription,
          imgURL: badge.imgURL,
        })),
      }); 
     
    }
  }

  sendRequestFour = async (e) => {
    const response = await fetch(api.base + api.handlers.myuser, {
        method: "GET",
        headers: new Headers({
          "Authorization": localStorage.getItem("Authorization")
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        this.setError(error);
        return;
    }
    const user = await response.json();
    this.props.setUser(user);
  }

  sendAllRequests =(badge) => {
    this.sendRequestTwo(badge);
    setTimeout(() => {
      this.sendRequestFour();
    }, 1000);
    setTimeout(() => {
      this.sendRequestThree();
    }, 1000);
  }

  componentWillMount() {
    {this.sendRequest()}
    {this.sendRequestThree()}
  }

  componentDidUpdate = () => { ReactDOM.findDOMNode(this).scrollIntoView(); }

  setError = (error) => {
      this.setState({ error })
  }

  render() {
      const { error} = this.state;
      const listItems = this.state.badges.map((badge) =>
        <li>
          <Card style={{ width: '18rem' }}>
            <h4>Cost: <span className="red">{badge.cost}</span></h4>
            <Card.Img variant="top" src={badge.imgURL} />
            <Card.Body>
              <h2>{badge.badgeName}</h2>
              <Card.Text>
                {badge.badgeDescription}
              </Card.Text>
              <Button variant="primary" disabled={this.state.userBadges.some(v => v.badgeID == badge.badgeID)} onClick={() => this.sendAllRequests(badge)}>ADD TO PROFILE</Button>
            </Card.Body>
          </Card>
        </li>
      );
      return <div className="marketplace">
          <Errors error={error} setError={this.setError} />
          <div className="picture">
            <div className="text">
              <h1>Market<span className="red">place</span></h1>
              <p>Welcome to a place where you get <b>rewarded</b> for your efforts! The <b><span className="red">badges</span></b> provided below can be <b>pinned to your
              profile</b>. This is similar to how people in support groups recieve badges for <b>milestones achieved in the quitting process</b>.
              The colors of most of our badges are <b>inspired by the official AA coin milestone colors</b>. You can purchase badges through <b><span className="red">points</span></b>. You can <b>earn points</b> by
              generally <b>interacting with the website</b> - such as using the sobrierty clock as well as engaging with our threads section.</p>
             </div>
            <img src="images/marketplace.png"/>
          </div>
          <h5>Points Available: <span className="red">{this.props.user.points}</span></h5>
          <div className="badges">
            {listItems}
          </div>
          
      </div>
  }

}

export default Marketplace;