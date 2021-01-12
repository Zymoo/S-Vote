import React from "react";
import ReactHtmlParser from "react-html-parser";
import authHeader from "../services/auth-header";

export default class OrganizerForm extends React.Component {
  state = {
    emails: [{ email: "", password: "" }],
    shamir: 3,
    errorMessages: "",
  };
  handleChange = (e) => {
    if (["email", "password"].includes(e.target.className)) {
      let emails = [...this.state.emails];
      emails[e.target.dataset.id][e.target.className] = e.target.value;
      this.setState({ emails });
    }
  };
  addShareHolder = () => {
    this.setState((prevState) => ({
      emails: [...prevState.emails, { email: "", password: "" }],
    }));
  };
  handleSubmit = async (e) => {
    this.setState({ errorMessages: "" });
    let user = JSON.parse(localStorage.getItem("auth"));
    let emails = [];
    for (const val of this.state.emails) {
      emails.push(val.email);
      // temporary
      const request = new Request("http://localhost:3001/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          email: val.email,
          password: val.password,
          roles: ["shareholder"],
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: authHeader(),
        }),
      });
      fetch(request)
        .then((response) => {
          response
            .json()
            .then((json) => {
              this.setState((prevState) => ({
                errorMessages:
                  prevState.errorMessages +
                  "Creating shareholder: " +
                  val.email +
                  " " +
                  json.message +
                  "<p/>",
              }));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const request = new Request("http://localhost:3001/organizer/begin", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        emails: emails,
        shamir: this.state.shamir,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: authHeader(),
      }),
    });
    await fetch(request);
    e.preventDefault();
  };

  render() {
    let { emails, shamir } = this.state;
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        {emails.map((val, idx) => {
          let shareHolderId = `Shareholder-${idx}`,
            passwordId = `Pass-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={shareHolderId}>{`Shareholder #${idx + 1}`}</label>
              <input
                type="text"
                name={shareHolderId}
                data-id={idx}
                id={shareHolderId}
                className="email"
              />
              <label htmlFor={passwordId}>Password</label>
              <input
                type="text"
                name={passwordId}
                data-id={idx}
                id={passwordId}
                className="password"
              />
            </div>
          );
        })}
        <label htmlFor="name">Shamir</label>
        <input
          type="text"
          name="description"
          id="description"
          defaultValue={shamir}
        />
        <p />

        <button
          type="button"
          className="btn btn-dark btn-lg btn-block"
          onClick={this.addShareHolder}
        >
          Add new Shareholder
        </button>
        <p />
        <input
          type="submit"
          value="Organize Voting"
          className="btn btn-dark btn-lg btn-block"
        />
        {this.state.errorMessages && (
          <h3 className="error">
            {" "}
            {ReactHtmlParser(this.state.errorMessages)}{" "}
          </h3>
        )}
      </form>
    );
  }
}
