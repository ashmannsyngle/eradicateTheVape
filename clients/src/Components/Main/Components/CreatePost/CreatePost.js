import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            amount: 10,
            anon: false,
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { content, anon } = this.state;
        const sendData = { content, anon };
        const response = await fetch(api.base + api.handlers.specificThreads + this.props.thread.id, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (content == "") {
            this.setError("Cannot make an empty post!");
            return;
        }
        if (response.status >= 300) {
            const error = await response.text();
            this.setError(error);
            return;
        }
        alert("Post Created!")
        this.sendRequestTwo()
        setTimeout(() => {
            this.sendRequestThree()
          }, 1000);
        this.props.setPage(e, PageTypes.specificThreads);
    }

    sendRequestTwo = async (e) => {
        const { amount } = this.state;
        const sendData = { amount };
        const response = await fetch(api.base + api.handlers.progressPoints, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            this.setError(error);
            return;
        }
        this.props.setPage(e, PageTypes.specificThreads);
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

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    toggleChange = () => {
        this.setState({
          anon: !this.state.anon,
        });
      }
      
    componentWillMount() {
        {window.scrollTo(0, 0);}
      }



    render() {
        const { content, anon, error } = this.state;
        return <div className="editProfile" id="post">
            <span>
                <Errors error={error} setError={this.setError} />
                <h2>Write a <span className="red">post</span>:</h2>
                <form onSubmit={this.sendRequest}>
                <div className="createthread">
                    <span>Would you like to be anonymous?</span>
                    <label className="checkbox-label">
                        <input name={"anon"} value={anon} type="checkbox" checked={this.state.anon} onChange={(e) => this.toggleChange()} />
                        <span class="checkbox-custom" />
                    </label>
                </div>
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