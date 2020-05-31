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
            error: ''
        }
    }

    sendRequest = async (e) => {
        //e.preventDefault();
        const response = await fetch(api.base + api.handlers.marketplace, {
            method: "GET"
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
            imgURL: badge.imgURL,
          }))
        });
        //this.props.setBadges(badges);
    }

    componentWillMount() {
      {this.sendRequest()}
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        //{this.sendRequest()}
        //console.log(this.state.badges)
        const { error} = this.state;
        const listItems = this.state.badges.map((badge) =>
          <li>
            <Card style={{ width: '18rem' }}>
              <h4>Cost: {badge.cost}</h4>
              <Card.Img variant="top" src="images/award.png" />
              <Card.Body>
                <h2>Name of Badge</h2>
                <Card.Text>
                  Add this to your profile for free! Think of this as a gift from us to you for having the courage to log onto our website.
                </Card.Text>
                <Button variant="primary">ADD TO PROFILE</Button>
              </Card.Body>
            </Card>
          </li>
        );
        return <div className="marketplace">
            <Errors error={error} setError={this.setError} />
            {listItems}
        </div>
    }

}

export default Marketplace;