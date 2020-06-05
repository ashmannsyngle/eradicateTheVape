import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';

class UpdateName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            bio: '',
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { firstName, lastName , bio} = this.state;
        const sendData = { firstName, lastName, bio};
        const response = await fetch(api.base + api.handlers.myuser, {
            method: "PATCH",
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
        alert("Profile updated.")
        const user = await response.json();
        this.props.setUser(user);
        this.props.setPage(e, PageTypes.profile);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { firstName, lastName, bio, error } = this.state;
        return <div className="editProfile">
            <Errors error={error} setError={this.setError} />
            <h2><span className="red">Edit</span> your profile:</h2>
            <form onSubmit={this.sendRequest}>
                <div>
                    <span>First name: </span>
                    <input name={"firstName"} value={firstName} onChange={this.setValue} />
                </div>
                <div>
                    <span>Last name: </span>
                    <input name={"lastName"} value={lastName} onChange={this.setValue} />
                </div>
                <div>
                    <span>Bio: </span>
                    <input name={"bio"} value={bio} onChange={this.setValue} />
                </div>
                <input type="submit" value="UPDATE PROFILE"/>
                <input type="back" value="GO BACK" onClick={(e) => this.props.setPage(e, PageTypes.profile)}/>
            </form>
        </div>
    }

}

export default UpdateName;