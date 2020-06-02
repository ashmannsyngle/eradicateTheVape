import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';

class CreatePost extends Component {
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
        const response = await fetch(api.base + api.handlers.specificThreads + this.props.thread.id, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error);
            this.setError(error);
            return;
        }
        alert("Post Created!")
        this.props.setPage(e, PageTypes.specificThreads);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { content, error } = this.state;
        return <div className="editProfile" id="post">
            <span>
                <Errors error={error} setError={this.setError} />
                <h2>Write a <span className="red">post</span>:</h2>
                <form onSubmit={this.sendRequest}>
                    <div>
                        <textarea name={"content"} value={content} onChange={this.setValue}/>
                    </div>
                    <input type="submit" value="CREATE POST"/>
                    <input type="back" value="GO BACK" onClick={(e) => this.props.setPage(e, PageTypes.specificThreads)}/>
                </form>
            </span>
        </div>
    }

}

export default CreatePost;