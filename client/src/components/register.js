import React from "react";

class Register extends React.Component {
  state = {
    email: "",
    name: "",
    mobile: "",
    password: "",
    studentsNum: "",
    website: "",
    signInEmail: "",
    signInPassword: "",
    isLoading: false
  };

  onLogout = event => {
    console.log("You are processed to logout");
    fetch("/account/me/token", {
      method: "DELETE",
      headers : {
        "Content-Type" : "application/json"
      }
    });
  };

  onRegister = event => {
    event.preventDefault();
    fetch("/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        name: this.state.name,
        mobile: this.state.mobile,
        password: this.state.password,
        studentsNum: this.state.studentsNum,
        website: this.state.website
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log("json", json);
      });
  };

  onLogin = event => {
    event.preventDefault();
    fetch("/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log("json", json);
        this.setState({ isLoading: true });
      });
  };

  onEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };

  onMobileChange = event => {
    this.setState({ mobile: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  onStudentsNumChange = event => {
    this.setState({ studentsNum: event.target.value });
  };

  onWebsiteChange = event => {
    this.setState({ website: event.target.value });
  };

  onSigninEmailChange = event => {
    this.setState({ signInEmail: event.target.value });
  };
  onSigninPasswordChange = event => {
    this.setState({ signInPassword: event.target.value });
  };

  render() {
    return (
      <div className="register-content">
        <form>
          <h3>Sign in with the email</h3>
          <label>Email :</label>
          <input
            name="email"
            value={this.state.signInEmail}
            onChange={this.onSigninEmailChange}
            placeholder="Enter your email"
          />
          <label>Password :</label>
          <input
            name="email"
            value={this.state.signInPassword}
            onChange={this.onSigninPasswordChange}
            placeholder="Enter your password"
          />
          <button onClick={this.onLogin}>Login</button>
        </form>
        <form>
          <h3>Register with the email</h3>

          <label>Email :</label>

          <input
            name="email"
            value={this.state.email}
            onChange={this.onEmailChange}
            placeholder="Enter your email"
          />
          <label>Name :</label>

          <input
            name="name"
            value={this.state.name}
            onChange={this.onNameChange}
            placeholder="Enter your name"
          />
          <label>Mobile :</label>

          <input
            name="mobile"
            value={this.state.mobile}
            onChange={this.onMobileChange}
            placeholder="Enter your mobile"
          />

          <label>Password :</label>

          <input
            name="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
            placeholder="Enter your password"
          />

          <label>Number of students :</label>

          <input
            name="students"
            value={this.state.studentsNum}
            onChange={this.onStudentsNumChange}
            placeholder="Enter number of students"
          />
          <label>Website :</label>

          <input
            name="website"
            value={this.state.website}
            onChange={this.onWebsiteChange}
            placeholder="Enter your website"
          />

          <button onClick={this.onRegister}>Register</button>
        </form>
        <button onClick={this.onLogout}>Logout</button>
      </div>
    );
  }
}

export default Register;

//www.maneesha.venigalla.com

//password

//Maneesha
