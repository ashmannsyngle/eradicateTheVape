import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';

class CreateThread extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { name, description } = this.state;
        const sendData = { name, description };
        const response = await fetch(api.base + api.handlers.threads, {
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
        alert("Thread Created!")
        this.props.setPage(e, PageTypes.threads);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { name, description, error } = this.state;
        return <div className="editProfile">
            <Errors error={error} setError={this.setError} />
            <h2><span className="red">Create</span> a thread:</h2>
            <form onSubmit={this.sendRequest}>
                <div>
                    <span>Name of thread: </span>
                    <input name={"name"} value={name} onChange={this.setValue} />
                </div>
                <div>
                    <span>Description: </span>
                    <input name={"description"} value={description} onChange={this.setValue} />
                </div>
                <input type="submit" value="CREATE THREAD"/>
                <input type="back" value="GO BACK" onClick={(e) => this.props.setPage(e, PageTypes.threads)}/>
            </form>
        </div>
    }

}

export default CreateThread;