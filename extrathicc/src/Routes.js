import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./js/HomePage";

const Routes = () => {
  return (
    <Switch>
      <Route path="/home" component={HomePage} />;
      <Route path="/login" component={Login} />;
      <Route path="/registration" component={Registration} />;
    </Switch>
  );
};

export default Routes;
