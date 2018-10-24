import React, { Component } from "react";
//import "./css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
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
    event.preventDefault();
  };

  render() {
    return (
      <div className="Login">
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
            <Button variant="outlined" color="secondary" type="submit">
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    );
  }
}

export default Login;
