import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';

class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            badges: []
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
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
        const badges = await response.json();
        this.props.setBadges(badges);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { badges} = this.state;
        return <>
            <Errors error={error} setError={this.setError} />
            <div>{badges}</div>
        </>
    }

}

export default Marketplace;