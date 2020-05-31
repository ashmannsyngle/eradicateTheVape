import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';



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
          <li>{badge.badgeID}</li>
        );
        return <div className="marketplace">
            <Errors error={error} setError={this.setError} />
            <ul>{listItems}</ul>
            
        </div>
    }

}

export default Marketplace;