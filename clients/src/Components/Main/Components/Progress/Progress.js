import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Button from 'react-bootstrap/Button';


class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressID: 0,
            daysSober: 0,
            dateLogged: '',
            userID: 0,
            error: ''
        }
    }

    sendRequest = async (e) => {
        //e.preventDefault();
        const response = await fetch(api.base + api.handlers.progress, {
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
        const progress = await response.json();
        this.setState ({
          progressID: progress.progressID,
          daysSober: progress.daysSober,
          dateLogged: new Date(progress.dateLogged),
          userID: progress.userID
        })
        console.log(this.state.dateLogged)
    }

    sendRequestTwo = async (e) => {
      var timeDiff = new Date() - this.state.dateLogged;
      if (this.state.daysSober != 0 && timeDiff / (1000 * 3600) < 24) {
        alert("You cannot log a day unless 24 hours have passed since your last log!");
        this.setState({buttonDisable: true})
      } else {
        //e.preventDefault();
          const response = await fetch(api.base + api.handlers.progress, {
            method: "PATCH",
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
        const progress = await response.json();
        this.setState ({
          progressID: progress.progressID,
          daysSober: progress.daysSober,
          dateLogged: new Date(progress.dateLogged),
          userID: progress.userID
        })
      }
      
  }

  sendRequestThree = async (e) => {
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

sendAllRequests =() => {
  this.sendRequestTwo();
  //this.sendRequest();
  setTimeout(() => {
    this.sendRequestThree();
  }, 1000);
  //this.sendRequestThree();
}

    componentWillMount() {
      {this.sendRequest()}
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const {progressID, daysSober, userID, error} = this.state;
        return <div className="progress">
            <Errors error={error} setError={this.setError} />
            <div className="display-user">
              <h1>Logged in as: <span className="red">{this.props.user.userName}</span></h1> 
            </div>
            <div className="picture">
              <div className="text">
                <h1>Sobreity <span className="red">Clock</span></h1>
                <p>The first step to overcoming your addiction is acceptance. Think of this as a sobriety clock. Here, you can keep track of the exact number of days you've been sober.
               All you need to do is click on the "Log Sober Day" button below and we'll update the number of days you've been sober. Once you log in, you won't be able to log once more for 24 hours since the
               time you logged. You can earn points by logging in every day that you are sober. You are given 100 points for every day logged into the 'sobriety clock. You can use these points to buy cool badges 
               from the Marketplace! Finally, remember - be honest to yourself.</p>
              </div>
              <div className="clockTwo">
                <h2><span className="red">{daysSober}</span></h2>
                <p>Days Sober</p>
              </div>
              
            </div>
            <div className="progressButton">
              <Button variant="primary" onClick={() => {this.sendAllRequests()}}>LOG SOBER DAY</Button>
            </div>
        </div>
    }

}

export default Progress;