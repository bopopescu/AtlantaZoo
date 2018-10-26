import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class Registratino extends Component{
    constructor(props) {
    super(props);
    // this.redirect = this.redirect.bind(this);
    this.state = {
      email: "",  
      username: "",
      password: "",
      confirm: "",
      redirect: false
    };
    }

    validateForm() {}

    render() {
        return (
            <div className="Registration">
                <form autoComplete="off" onSubmit={this.handleSubmit}>

                    
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <TextField
                            id="email"
                            label="Email"
                            placeholder="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"
                        />      
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
                        />                      
                        <TextField
                            id="confirm"
                            label="Confirm Password"
                            placeholder="confirm"
                            value={this.state.confirm}
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"
                        />  
                    </Grid>
                    <Grid 
                        container 
                        direction="row" 
                        justify="center" 
                        alignItems="center"
                    >
                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={!this.validateForm()}
                        >
                        Register Visitor
                        </Button>
                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={!this.validateForm()}
                        >
                        Register Staff
                        </Button>                    
                    </Grid>
                </form>
            </div>
        )

    } 




}