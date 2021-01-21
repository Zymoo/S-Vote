import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      candidates:null
    }
  }

  async componentDidMount() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
  };
  const serverURL = "http://localhost:3001/voter/result/";
  fetch(serverURL, requestOptions)
      .then(response => response.json())
      .then(response => {
          this.setState({
              candidates: response.candidates,
              result: response.candidates
          })
      }).then(() => {
          localStorage.setItem('auth-code', this.state.password)
      }).catch((err) => {
          console.log(err)
      });
  }

  render() {
    if (this.state.result) {
      return (
        <div>
          <h3> Here are the results: </h3>
        </div>
      );
    }
    return (
      <div>
        <h3> Elections not yet finished! </h3>
      </div>
    );
  }
};