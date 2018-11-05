import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";

const Routes = () => {
  return (
    <Switch>
      {/* <Route path="/" component={App} />; */}
      <Route path="/login" component={Login} />;
      <Route path="/registration" component={Registration} />;
    </Switch>
  );
};

export default Routes;
