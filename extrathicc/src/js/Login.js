import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
// import Header from "./Header";

class Login extends Component {
  constructor(props) {
    super(props);
    // this.redirect = this.redirect.bind(this);
    this.state = {
      username: "",
      password: "",
      redirect: false
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    fetch('http://localhost:5000/login',
      {
        method: 'POST',
        body: JSON.stringify({ username: this.state.username, password: this.state.password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          this.setState({ redirect: true });
        } else {
          response.json().then(resp => alert(resp.message));
        }
      })
      .catch(error => console.error('Error:', error));
    event.preventDefault();
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    return (
      <div className="Login">
        <Grid container justify="center">
          <header id="title">Login</header>
        </Grid>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <TextField
              id="username"
              label="Username"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="password"
              label="Password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
              type="password"
            />
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Button
              variant="outlined"
              type="submit"
              disabled={!this.validateForm()}
            >
              Login
            </Button>

            {this.renderRedirect()}
            <Button
              variant="outlined"
              color="secondary"
              type="submit"
              onClick={this.setRedirect}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    );
  }
}

export default Login;
