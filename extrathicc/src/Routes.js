import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./js/HomePage";
import Exhibits from "./js/Exhibits";

const Routes = () => {
  return (
    <Switch>
      <Route path="/home" component={HomePage} />;
      <Route path="/login" component={Login} />;
      <Route path="/registration" component={Registration} />;
      <Route path="/exhibits/" component={Exhibits} />;
      {/* <Route path="/shows" component={Shows} />;
      <Route path="/animals" component={Animals} />;
      <Route path="/exhibits/history" component={Exhibit_History} />;
      <Route path="/shows/history" component={Show_History} />; */}
    </Switch>
  );
};

export default Routes;
