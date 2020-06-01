import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


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
      //e.preventDefault();
      const response = await fetch(api.base + api.handlers.marketplace, {
          method: "GET",
          headers: new Headers({
            "Authorization": localStorage.getItem("Authorization")
        })
      });
      if (response.status >= 300) {
          const error = await response.text();
          console.log(error);
          this.setError(error);
          return;
      }
      //alert("") // TODO make this better by refactoring errors IS THIS REQUIRED?
      const badgesResponse = await response.json();
      //console.log(response)
      this.setState({
        badges: badgesResponse.map(badge => ({
          badgeID: badge.badgeID,
          cost: badge.cost,
          badgeName: badge.badgeName,
          badgeDescription: badge.badgeDescription,
          imgURL: badge.imgURL,
        }))
      });
      //this.props.setBadges(badges);
  }

  sendRequestTwo = async (e) => {
    //e.preventDefault();
    // const { badge } = this.state;
    // const sendData = { badge };
    const response = await fetch(api.base + api.handlers.marketplaceBadges + e.badgeID, {
        method: "PATCH",
        headers: new Headers({
          "Authorization": localStorage.getItem("Authorization"),
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        console.log(error);
        this.setError(error);
        return;
    }
    alert("Badge successfully added to your profile!") 
  }

  sendRequestThree = async (e) => {
    //e.preventDefault();
    const response = await fetch(api.base + api.handlers.marketplaceBadges + "1", {
      method: "GET",
      headers: new Headers({
        "Authorization": localStorage.getItem("Authorization")
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        console.log(error);
        this.setError(error);
        return;
    }
    //alert("") // TODO make this better by refactoring errors IS THIS REQUIRED?
    const badgesResponse = await response.json();
    //console.log(response)
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
   
    //this.props.setBadges(badges);
  }

  sendRequestFour = async (e) => {
    //e.preventDefault();
    const response = await fetch(api.base + api.handlers.myuser, {
        method: "GET",
        headers: new Headers({
          "Authorization": localStorage.getItem("Authorization")
      })
    });
    if (response.status >= 300) {
        const error = await response.text();
        console.log(error);
        this.setError(error);
        return;
    }
    //alert("") // TODO make this better by refactoring errors IS THIS REQUIRED?
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

  setError = (error) => {
      this.setState({ error })
  }

  render() {
      //{this.sendRequest()}
      console.log(this.state.userBadges)
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
          <div className="display-user">
            <h1>Logged in as: <span className="red">{this.props.user.userName}</span></h1> 
          </div>
          <h1>Marketplace</h1>
          <p>Welcome to a place where you get rewarded for your efforts! </p>
          <h5>Points Available: <span className="red">{this.props.user.points}</span></h5>
          <div className="badges">
            {listItems}
          </div>
          
      </div>
  }

}

export default Marketplace;