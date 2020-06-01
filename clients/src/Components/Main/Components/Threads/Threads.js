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
              <p>Welcome to the threads section of your website! Share your addiction/addiction recovery stories here or just
                 go through the other users discussions. There are a variety of threads that you can explore. Just scroll down and click on the thread
                 that you find most interesting! Click on 'CREATE NEW THREAD' if you want to start a conversation. We will randomly award you points based
                 on your interaction with these threads so make sure you're an active member! We believe in your recovery and urge you to talk about it!
              </p>
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