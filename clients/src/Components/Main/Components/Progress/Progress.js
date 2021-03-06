import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import ReactDOM from 'react-dom'
import Errors from '../../../Errors/Errors';
import Button from 'react-bootstrap/Button';


class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressID: 0,
            daysSober: 0,
            dateLogged: new Date(),
            userID: 0,
            error: ''
        }
    }

    sendRequest = async (e) => {
        const response = await fetch(api.base + api.handlers.progress, {
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
        const progress = await response.json();
        this.setState ({
          progressID: progress.progressID,
          daysSober: progress.daysSober,
          dateLogged: new Date(progress.dateLogged),
          userID: progress.userID
        })
    }

    sendRequestTwo = async (e) => {
      var today = new Date();
      if (this.state.daysSober != 0 && today.getDate() === this.state.dateLogged.getDate()) {
        alert("You cannot log a day on the same day as your last log! Come back tomorrow!");
        this.setState({buttonDisable: true})
      } else {
          const response = await fetch(api.base + api.handlers.progress, {
            method: "PATCH",
            headers: new Headers({
              "Authorization": localStorage.getItem("Authorization")
          })
        });
        if (response.status >= 300) {
            const error = await response.text();
            this.setError(error);
            return;
        }
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

sendAllRequests =() => {
  this.sendRequestTwo();
  setTimeout(() => {
    this.sendRequestThree();
  }, 1000);
}

    componentWillMount() {
      {this.sendRequest()}
    }

    componentDidUpdate = () => { ReactDOM.findDOMNode(this).scrollIntoView(); }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const {progressID, daysSober, userID, error} = this.state;
        return <div className="progress">
            <Errors error={error} setError={this.setError} />
            <div className="picture">
              <div className="text">
                <h1>Sobreity <span className="red">Clock</span></h1>
                <p>The first step to overcoming your addiction is <b>acceptance</b>. Think of this as a <b>sobriety clock</b>. Here, you can keep track of the exact number of <b>days</b> you've been <b>sober</b>.
               All you need to do is click on the <b><span className="red">Log Sober Day</span></b> button below and we'll update the number of days you've been sober. Once you log a sober day, <b>you won't be able to do it again until the <span className="red">next</span> day</b>. You are <b>awarded <span className="red">100</span> points</b> for every day logged into the 'sobriety clock. You can use these points to <b>buy cool badges </b>
               from the <b>Marketplace</b>! Finally, remember - <b>be honest to yourself</b>.</p>
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