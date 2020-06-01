import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import Errors from '../../../Errors/Errors';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link, RichText, Date} from 'prismic-reactjs';


class Threads extends Component {
  constructor(props) {
      super(props);
      this.state = {
          threads: [],
          error: ''
      }
  }

  sendRequest = async (e) => {
      //e.preventDefault();
      const response = await fetch(api.base + api.handlers.threads, {
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
      const threadResponse = await response.json();
      //console.log(response)
      this.setState({
        threads: threadResponse.map(thread => ({
          id: thread.id,
          name: thread.name,
          description: thread.description,
          creator: thread.creator,
          createdAt: thread.createdAt,
          editedAt: thread.editedAt
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

  getParsedTime = (timetoParse) => {
    const timestamp = Date(timetoParse);
    var formattedTimestamp = Intl.DateTimeFormat('en-US',{
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }).format(timestamp);
    return formattedTimestamp;
  }

  render() {
      const { error} = this.state;
      const listItems = this.state.threads.map((thread) =>
        <li>
          <div className="one-thread" onClick={(e) => { this.props.setPage(e, PageTypes.specificThreads); this.props.setThread(thread);}}>
            <div className="one">
              <img src={thread.creator.photoURL}/>
              <h5>{thread.creator.userName}</h5>
            </div>
            <div className="two">
              <h2>{thread.name}</h2>
              <h3>{thread.description}</h3>
            </div>
            <div className="three">
              <h2>Last Edited:</h2>
              <h3>{this.getParsedTime(thread.editedAt)}</h3>
            </div>
          </div>
        </li>
      );
      return <div className="threads">
          <Errors error={error} setError={this.setError} />
          <div className="display-user">
            <h1>Logged in as: <span className="red">{this.props.user.userName}</span></h1> 
          </div>
          <div className="picture">
            <div className="text">
              <h1>Threads</h1>
              <p>Welcome to a place where you get rewarded for your efforts! The badges provided below can be pinned to your
              profile in a way that replicates how people in support groups recieve badges for milestones achieved in the quitting process.
              The colors of our badges are inspired by the official AA coin milestone colors. You can purchase badges through points. You can earn points by
              logging in every day that you are sober as well as by interacting with our threads section.</p>
             </div>
            <img src="images/threads.png"/>
          </div>
          <h2>Check out the latest <span className="red">threads</span>:</h2>
          <div className="createButton">
              <Button variant="primary" onClick={(e) => { this.props.setPage(e, PageTypes.createPost)}}>CREATE A NEW THREAD</Button>
          </div>
          <div className="badges">
            {listItems}
          </div>
      </div>
  }

}

export default Threads;