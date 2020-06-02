import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import Errors from '../../../Errors/Errors';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link, RichText, Date} from 'prismic-reactjs';


class SpecificThreads extends Component {
  constructor(props) {
      super(props);
      this.state = {
          posts: [],
          error: ''
      }
  }

  sendRequest = async (e) => {
      //e.preventDefault();
      const response = await fetch(api.base + api.handlers.specificThreads + this.props.thread.id, {
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
      const postResponse = await response.json();
      //console.log(response)

      if (postResponse != null) {
        this.setState({
          posts: postResponse.map(post => ({
            id: post.id,
            threadID: post.threadID,
            content: post.content,
            createdAt: post.createdAt,
            creator: post.creator,
            editedAt: post.editedAt
          }))
        });
      } 
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
      const listItems = this.state.posts.map((post) =>
        <li>
          <div className="one-thread" onClick={(e) => { this.props.setPage(e, PageTypes.specificThreads)}}>
            <div className="one">
              <img src="images/default_profile.png"/>
              <h5>{post.creator.userName}</h5>
            </div>
            <div className="two">
              <h2>{this.props.thread.name}</h2>
              <h3>{post.content}</h3>
            </div>
            <div className="three">
              <h2>Last Edited:</h2>
              <h3>{this.getParsedTime(post.editedAt)}</h3>
            </div>
          </div>
        </li>
      );
      return <div className="threads">
          <Errors error={error} setError={this.setError} />
          <div className="picture">
            <div className="text">
              <h1>Posts for <span className="red">{this.props.thread.name}</span>:</h1>
              <p>{this.props.thread.description}</p>
              <h5>Thread created by: </h5>
              <img src={this.props.thread.creator.photoURL}/>
              <h5 className="username">{this.props.thread.creator.userName}</h5>
             </div>
            <img src="images/posts.png"/>
          </div>
          <h2>Check out the latest <span className="red">posts</span>:</h2>
          <div className="createButton">
              <Button variant="primary" onClick={(e) => { this.props.setPage(e, PageTypes.createPosts)}}>CREATE A NEW POST</Button>
          </div>
          <div className="badges">
            {listItems}
          </div>
      </div>
  }

}

export default SpecificThreads;