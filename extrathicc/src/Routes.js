import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./js/HomePage";
import Exhibits from "./js/Exhibits";
import ExhibitHistory from "./js/ExhibitHistory";
import ExhibitDetail from "./js/ExhibitDetail";
import ShowHistory from "./js/ShowHistory";
import Shows from "./js/Shows";
import Animals from "./js/Animals";

const Routes = () => {
  return (
    <Switch>
      <Route path="/home" component={HomePage} />;
      <Route path="/login" component={Login} />;
      <Route path="/registration" component={Registration} />;
      <Route path="/exhibits/" component={Exhibits} />;
      <Route path="/shows" component={Shows} />;
      <Route path="/animals" component={Animals} />;
      <Route path="/exhibit_history" component={ExhibitHistory} />;
      <Route path="/shows_history" component={ShowHistory} />;
      <Route path="/exhibits_id" component={ExhibitDetail} />;
    </Switch>
  );
};

export default Routes;