import React from "react";
import authHeader from "../services/auth-header";

export default class ShareHolderForm extends React.Component {
  state = {
    share: 0,
  };

  handleSubmit = async (e) => {
    let user = JSON.parse(localStorage.getItem("auth"));
    const request = new Request("http://localhost:3001/organizer/end", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        share: this.state.share,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: authHeader(),
      }),
    });
    await fetch(request);
    e.preventDefault();
  };
  handleChange = (e) => {
    if (["share"].includes(e.target.className)) {
        let share = e.target.value;
      this.setState({share});
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <label>{`Shareholder Key:`}</label>
        <input type="text" className="share" />
        <button
          type="submit"
          value="Submit"
          className="btn btn-dark btn-lg btn-block"
        >
          {" "}
          Submit my Key
        </button>
      </form>
    );
  }
}
