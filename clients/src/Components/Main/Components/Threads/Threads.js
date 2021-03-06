import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import Errors from '../../../Errors/Errors';
import Button from 'react-bootstrap/Button';
import {Date} from 'prismic-reactjs';
import ReactDOM from 'react-dom'



class Threads extends Component {
  constructor(props) {
      super(props);
      this.state = {
          threads: [],
          deletedThread: {},
          error: ''
      }
  }

  sendRequest = async (e) => {
      const response = await fetch(api.base + api.handlers.threads, {
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
      const threadResponse = await response.json();
      this.setState({
        threads: threadResponse.map(thread => ({
          id: thread.id,
          name: thread.name,
          description: thread.description,
          creator: thread.creator,
          anon: thread.anon,
          createdAt: thread.createdAt,
          editedAt: thread.editedAt,
          badges: []
        }))
      });

      for (var i = 0; i < this.state.threads.length; i++) {
        const temp = this.state.deletedThread
        const id = this.state.threads[i].id
        temp[id] = true
        this.setState({ deletedThread: temp})
        
        
        const currThread = this.state.threads[i]
        const response = await fetch(api.base + api.handlers.marketplaceBadges + currThread.creator.id, {
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
        const badgesResponse = await response.json();
        const prevState = this.state
        prevState.threads[i].badges = badgesResponse
        this.setState({ threads: prevState.threads})
      }
  }

  sendRequestTwo = async (e) => {
    const response = await fetch(api.base + api.handlers.specificThreads + e.id, {
        method: "DELETE",
        headers: new Headers({
            "Authorization": localStorage.getItem("Authorization"),
        })
    });
    if (response.status >= 300) {
        const error = await response.text();
        alert(error)
        return;
    }
    alert("Thread ''" + e.name + "' deleted!")
    this.props.setPage(e, PageTypes.threads);
}


  componentWillMount() {
    {this.sendRequest()}
    {window.scrollTo(0, 0);}
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

  renderBadges = (thread) => {
    if (thread.badges != null) {
      const badges = thread.badges.map((badge) =>
        <li>
          <img src={badge.imgURL} className="badge"/>
        </li>
      );
      return badges;
    } 
    return <></>
  }

  handler = (thread, event) => {
    this.sendRequestTwo(thread)
    if (thread.creator.id == this.props.user.id) {
      const temp = this.state.deletedThread
      temp[thread.id] = false
      this.setState({ deletedThread: temp})
    }
    event.stopPropagation()
  }

  checkDelete = (thread) => {
    if (thread.creator.id != this.props.user.id) {
      return false;
    }
    return true;
  }

  render() {
      const { error} = this.state;
      const listItems = this.state.threads.map((thread) =>
      <li>
      { this.state.deletedThread[thread.id] ? 
      <div className="one-thread" onClick={(e) => { this.props.setPage(e, PageTypes.specificThreads); this.props.setThread(thread);}}>
          <div className="one">
          {thread.anon ? <div>
            <div>
              <img src="images/anonymous.png"/>
              <h5>Anonymous User</h5>
            </div></div>: <div>
              <div>
                {this.renderBadges(thread)}
              </div>
              <img src={thread.creator.photoURL}/>
              <h5>{thread.creator.userName}</h5>
            </div>}            
          </div>
          <div className="two">
            <h2>{thread.name}</h2>
            <h3>{thread.description}</h3>
          </div>
          <div className="three">
            <h2>Created At:</h2>
            <h3>{this.getParsedTime(thread.createdAt)}</h3>
          </div>
          { this.checkDelete(thread) ? 
          <div className="four">
            <img src="images/trash.png"  onClick={(event) => this.handler(thread, event)}/>      
          </div> : null}
          
        </div> : null }
        
      </li>
      
      );
      return <div className="threads">
          <Errors error={error} setError={this.setError} />
          <div className="picture">
            <div className="text">
              <h1>Threads</h1>
              <p>Welcome to the threads! Feel free to <b>share</b> your thoughts/feelings here or just
                 browse through what others are thinking. There are a <b>variety of threads</b> that you can explore. Just scroll down and click on the thread
                 that you find most interesting. <b>Create a new thread</b> if you want to start a new conversation/topic. You will also be <b>randomly awarded points</b> based
                 on your interaction with these threads so <b>make sure you're active</b>. We believe in your recovery and urge you to talk about it!
              </p>
             </div>
            <img src="images/threads.png"/>
          </div>
          <h2>Check out the latest <span className="red">threads</span>:</h2>
          <h5>Clicking on a thread leads to it's posts</h5>
          <div className="createButton">
              <Button variant="primary" onClick={(e) => { this.props.setPage(e, PageTypes.createThreads)}}>CREATE A NEW THREAD</Button>
          </div>
          <div className="badges">
            {listItems}
          </div>
      </div>
  }

}

export default Threads;