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
          userID: progress.userID
        })
    }

    sendRequestTwo = async (e) => {
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
        userID: progress.userID
      })
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
    console.log(user)
}

sendAllRequests =() => {
  this.sendRequestTwo();
  this.sendRequest();
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
        console.log(daysSober)
        return <div className="progress">
            <Errors error={error} setError={this.setError} />
            <div className="display-user">
              <h1>Logged in as: <span className="red">{this.props.user.userName}</span></h1> 
            </div>
            <h3>{this.props.user.firstName}, track your <span className="red">progress</span> here</h3>
            <div className="clock">
              <div className="clockOne">
                <img src="images/progress.png"/>
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