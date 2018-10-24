import Login from "./js/Login";
import App from "./App";
import { Switch, Route } from "react-router-dom";
import React from "react";

const Routes = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />;
      {/* <Route exact path="/" component={App} />; */}
    </Switch>
  );
};

export default Routes;
