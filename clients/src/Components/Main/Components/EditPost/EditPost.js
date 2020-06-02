import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';
import {Date} from 'prismic-reactjs';


class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { content } = this.state;
        const sendData = { content };
        const response = await fetch(api.base + api.handlers.posts + this.props.post.id, {
            method: "PATCH",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (content == "") {
            this.setError("Post content cannot be empty!");
            return;
        }
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error);
            this.setError(error);
            return;
        }
        alert("Post Updated!")
        this.props.setPage(e, PageTypes.specificThreads);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
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

      getParsedTime = (timetoParse) => {
        const timestamp = Date(timetoParse);
        console.log(timestamp)
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
        const { content, error } = this.state;
        const postPreview = (
        <li>
          <div className="one-thread" id="post">
            <div className="one">
              {/* <div>
                {this.renderBadges(this.props.post)}
              </div>         
              <img src={this.props.post.creator.photoURL}/>
              <h5>{this.props.post.creator.userName}</h5> */}
              {this.props.post.anon ? <div>
                <div>
                    <img src="images/anonymous.png"/>
                    <h5>Anonymous User</h5>
                </div></div>: <div>
                <div>
                    {this.renderBadges(this.props.post)}
                </div>
                    <img src={this.props.post.creator.photoURL}/>
                    <h5>{this.props.post.creator.userName}</h5>
                </div>} 
            </div>
            <div className="two" id="post">
              <h3>{this.props.post.content}</h3>
            </div>
            <div className="three">
              <h2>Last Edited:</h2>
              <h3>{this.getParsedTime(this.props.post.editedAt)}</h3>
            </div>
          </div>
        </li>            
        )
        
        return <div className="editProfile" id="post">
            <span>
                <Errors error={error} setError={this.setError} />
                <h2>Edit <span className="red">post</span>:</h2>
                {postPreview}
                <form onSubmit={this.sendRequest}>
                    <div>
                        <textarea name={"content"} value={content} onChange={this.setValue}/>
                    </div>
                    <input type="submit" value="EDIT POST"/>
                    <input type="back" value="GO BACK" onClick={(e) => this.props.setPage(e, PageTypes.specificThreads)}/>
                </form>
            </span>
        </div>
    }

}

export default EditPost;