import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignForm from '../SignForm/SignForm';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import PageTypes from '../../../../Constants/PageTypes/PageTypes';

/**
 * @class
 * @classdesc SignUp handles the sign up component
 */
class SignUp extends Component {
    static propTypes = {
        setPage: PropTypes.func,
        setAuthToken: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            userName: "",
            firstName: "",
            lastName: "",
            password: "",
            passwordConf: "",
            bio: "",
            error: ""
        };

        this.fields = [
            {
                name: "Email",
                key: "email"
            },
            {
                name: "Username",
                key: "userName"
            },
            {
                name: "First name",
                key: "firstName"
            },
            {
                name: "Last name",
                key: "lastName"
            },
            {
                name: "Password",
                key: "password"
            },
            {
                name: "Password Confirmation",
                key: "passwordConf"
            },
            {
                name: "Bio",
                key: "bio"
            },];
    }

    /**
     * @description setField will set the field for the provided argument
     */
    setField = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    /**
     * @description setError sets the error message
     */
    setError = (error) => {
        this.setState({ error })
    }

    /**
     * @description submitForm handles the form submission
     */
    submitForm = async (e) => {
        e.preventDefault();
        const { email,
            userName,
            firstName,
            lastName,
            password,
            passwordConf,
            bio } = this.state;
        const sendData = {
            email,
            userName,
            firstName,
            lastName,
            password,
            passwordConf,
            bio
        };
        const response = await fetch(api.base + api.handlers.users, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            this.setError(error);
            return;
        }
        const authToken = response.headers.get("Authorization")
        localStorage.setItem("Authorization", authToken);
        this.setError("");
        this.props.setAuthToken(authToken);
        const user = await response.json();
        var profileArray = [
            "images/bear.png",
            "images/cat.png",
            "images/chicken.png",
            "images/cow.png",
            "images/crow.png",
            "images/hen.png",
            "images/hippopotamus.png",
            "images/horse.png",
            "images/kangaroo.png",
            "images/koala.png",
            "images/marten.png",
            "images/monkey.png",
            "images/mouse.png",
            "images/owl.png",
            "images/panda.png",
            "images/penguin.png",
            "images/seagull.png",
            "images/tiger.png",
            "images/whale.png",
            "images/zebra.png",

        ];

        // TODO: UPDATE THIS IN THE DB SO THAT IT CAN BE VIEWED LATER (OUTSIDE OF PROPS)


        var randomNumber = Math.floor(Math.random()*profileArray.length);
        user.photoURL = profileArray[randomNumber]
        this.props.setUser(user);
    }

    render() {
        const values = this.state;
        const { error } = this.state;
        return <div className="sign-in-page">
            <div className="logo">
                <h1>EradicateThe<span className="red">Vape</span></h1>
            </div>
            <div className="container">
                <h1>Sign <span className="red">Up</span></h1>
            </div>
            <div className="form">
                <Errors error={error} setError={this.setError} />
                <SignForm
                    setField={this.setField}
                    submitForm={this.submitForm}
                    values={values}
                    fields={this.fields} />
                <div className="button-group">
                    <button onClick={(e) => this.props.setPage(e, PageTypes.signIn)}>ALREADY A USER? SIGN IN</button>
                </div>
            </div>
        </div>
    }
}

export default SignUp;