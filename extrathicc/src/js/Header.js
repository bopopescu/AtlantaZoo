import React, { Component } from "react";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: ""
    };
  }

  render() {
    return <header>{this.props.header}</header>;
  }
}
