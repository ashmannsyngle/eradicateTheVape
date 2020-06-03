import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import Errors from '../../../Errors/Errors';
import Button from 'react-bootstrap/Button';
import {Link, RichText, Date} from 'prismic-reactjs';


class SpecificThreads extends Component {
  constructor(props) {
      super(props);
      this.state = {
          posts: [],
          deletedPost:{},
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
            anon: post.anon,
            editedAt: post.editedAt,
            badges: []
          }))
        });
      }
      
      for (var i = 0; i < this.state.posts.length; i++) {
        const temp = this.state.deletedPost
        const id = this.state.posts[i].id
        temp[id] = true
        this.setState({ deletedPost: temp})
        
        const currPost = this.state.posts[i]
        const response = await fetch(api.base + api.handlers.marketplaceBadges + currPost.creator.id, {
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
        const badgesResponse = await response.json();
        const prevState = this.state
        prevState.posts[i].badges = badgesResponse
        this.setState({ posts: prevState.posts})
      }
      //this.props.setBadges(badges);
  }

  sendRequestTwo = async (e) => {
    //e.preventDefault();
    const response = await fetch(api.base + api.handlers.posts + e.id, {
        method: "DELETE",
        headers: new Headers({
            "Authorization": localStorage.getItem("Authorization"),
        })
    });
    if (response.status >= 300) {
        const error = await response.text();
        console.log(error);
        alert(error)
        return;
    }
    alert("Post deleted!")
    this.props.setPage(e, PageTypes.specificThreads);
}


  componentWillMount() {
    {window.scrollTo(0, 0);}
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

  renderBadges = (post) => {
    if (post.badges != null) {
      const badges = post.badges.map((badge) =>
        <li>
          <img src={badge.imgURL} className="badge"/>
        </li>
      );
      return badges;
    } 
    return <></>
  }

  handler = (post, event) => {
    this.sendRequestTwo(post)
    if (post.creator.id == this.props.user.id || this.props.thread.creator.id == this.props.user.id) {
      const temp = this.state.deletedPost
      temp[post.id] = false
      this.setState({ deletedPost: temp})
    }
    event.stopPropagation()
  }

  checkEdit = (post) => {
    if (post.creator.id != this.props.user.id) {
      return false;
    }
    return true;
  }

  checkDelete = (post) => {
    if (this.props.thread.creator.id != this.props.user.id) {
      return false;
    }
    return true;
  }


  render() {
      const { error} = this.state;
      const listItems = this.state.posts.map((post) =>
        <li>
        { this.state.deletedPost[post.id] ? 
          <div className="one-thread" id="post">
            <div className="one">
            {post.anon ? <div>
            <div>
              <img src="images/anonymous.png"/>
              <h5>Anonymous User</h5>
            </div></div>: <div>
              <div>
                {this.renderBadges(post)}
              </div>
              <img src={post.creator.photoURL}/>
              <h5>{post.creator.userName}</h5>
            </div>} 
            </div>
            <div className="two" id="post">
              <h3>{post.content}</h3>
            </div>
            <div className="three" id="post-three">
              <h2>Last Edited:</h2>
              <h3>{this.getParsedTime(post.editedAt)}</h3>
            </div>
            {this.checkEdit(post) ? 
            <div className="four" id="post-edit">
              <img src="images/edit.png"  onClick={(e) => { this.props.setPage(e, PageTypes.editPost); this.props.setPost(post)} }/>      
            </div> : null}
            {this.checkDelete(post) ? 
            <div className="four" id="post-delete">
              <img src="images/trash.png"  onClick={(event) => this.handler(post, event)}/>      
            </div> : null}
          </div> : null }
        </li>
      );
      return <div className="threads">
          <Errors error={error} setError={this.setError} />
          <div className="picture">
            <div className="text">
              <h1>Posts for <span className="red">{this.props.thread.name}</span>:</h1>
              <p>{this.props.thread.description}</p>
              <h5>Thread created by: </h5>
              { this.props.thread.anon ? <div>
                <img src="images/anonymous.png"/>
                <h5 className="username">Anonymous User</h5>
              </div> : <div>
                <img src={this.props.thread.creator.photoURL}/>
                <h5 className="username">{this.props.thread.creator.userName}</h5>
              </div>}
              { this.props.thread.anon ? 
              <h7>Remember that <b>Anonymous User</b> can <b>delete</b> your posts!</h7>:
              <h7>Remember that <b>{this.props.thread.creator.userName}</b> can <b>delete</b> your posts!</h7>}
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