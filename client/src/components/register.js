import React, { Component } from "react";
import Key from './key';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionToken: null,
            email: '',
            password: ''
        }
        this.handleSubmit = this.onSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }


    onSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        };
        const serverURL = "http://localhost:3001/voter/register/";
        fetch(serverURL, requestOptions)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    sessionToken: result
                })
            });
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    render() {
        if (this.state.sessionToken) {
            return <Key savedToken={this.state.sessionToken} />;
        }
        return (
            <form onSubmit={this.onSubmit}>
                <h3>Register now!</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input id="email" onChange={this.handleEmailChange} type="email" value={this.state.email} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Authorization code</label>
                    <input id="password" onChange={this.handlePasswordChange} type="password" value={this.state.password} className="form-control" placeholder="Enter code" />
                </div>

                <button type="submit" value="Submit" className="btn btn-dark btn-lg btn-block">Register</button>
            </form>
        );
    }
};