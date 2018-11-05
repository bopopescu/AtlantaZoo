import React, { Component } from "react";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      header: ""
    };
  }

  render() {
    {
      this.setState(this.props.value);
    }
    return (
      <div>
        <header>{this.state.header}</header>
      </div>
    );
  }
}

export default Header;

// const Header = () => (
//   <header>
//     <nav>
//       <ul>
//         <li><Link to='/'>Home</Link></li>
//         <li><Link to='/roster'>Roster</Link></li>
//         <li><Link to='/schedule'>Schedule</Link></li>
//       </ul>
//     </nav>
//   </header>
// )

// export default Header
