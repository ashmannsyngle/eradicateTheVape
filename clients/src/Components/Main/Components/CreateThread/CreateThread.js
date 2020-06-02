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
            amount: 50,
            anon: '',
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { name, description, anon } = this.state;
        console.log(anon)
        const sendData = { name, description, anon };
        const response = await fetch(api.base + api.handlers.threads, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (description.length > 499) {
            this.setError("Description cannot be more than 500 characters!");
            return;
        } else if (name.length > 79) {
            this.setError("Name cannot be more than 80 characters!");
            return;
        }
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error);
            this.setError(error);
            return;
        }
        alert("Thread Created!")
        this.sendRequestTwo()
        setTimeout(() => {
            this.sendRequestThree()
          }, 1000);
        this.props.setPage(e, PageTypes.threads);
    }

    sendRequestTwo = async (e) => {
        //e.preventDefault();
        const { amount } = this.state;
        const sendData = { amount };
        console.log(sendData)
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
            console.log(error);
            this.setError(error);
            return;
        }
        this.props.setPage(e, PageTypes.threads);
    }

    sendRequestThree = async (e) => {
        //e.preventDefault();
        const response = await fetch(api.base + api.handlers.myuser, {
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

    render() {
        const { name, description, anon, error } = this.state;
        return <div className="editProfile">
            <Errors error={error} setError={this.setError} />
            <h2><span className="red">Create</span> a thread:</h2>
            <form onSubmit={this.sendRequest}>
                <div className="createthread">
                    <span>Would you like to be <b>anonymous</b>?</span>
                    <label className="checkbox-label">
                        <input name={"anon"} value={anon} type="checkbox" checked={this.state.anon} onChange={(e) => this.toggleChange()} />
                        <span class="checkbox-custom" />
                    </label>
                </div>
                <div>
                    <span>Name of thread: </span>
                    <input name={"name"} value={name} onChange={this.setValue} />
                </div>
                <div>
                    <span>Description: </span>
                    <textarea name={"description"} value={description} onChange={this.setValue} />
                </div>
                <input type="submit" value="CREATE THREAD"/>
                <input type="back" value="GO BACK" onClick={(e) => this.props.setPage(e, PageTypes.threads)}/>
            </form>
        </div>
    }

}

export default CreateThread;