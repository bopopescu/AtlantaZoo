import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./js/HomePage";
import Exhibits from "./js/Exhibits";
import ExhibitHistory from "./js/ExhibitHistory";
import ExhibitDetail from "./js/ExhibitDetail";
import AnimalDetail from "./js/AnimalDetail";
import ShowHistory from "./js/ShowHistory";
import Shows from "./js/Shows";
import Animals from "./js/Animals";
import AssignedShows from "./js/AssignedShows";
import StaffHome from "./js/StaffHome";
import AdminHome from "./js/AdminHome";
import AddAnimal from "./js/AddAnimal";
import AddShow from "./js/AddShow";

const Routes = () => {
  return (
    <Switch>
      <Route path="/staffhome" component={StaffHome} />;
      <Route path="/adminhome" component={AdminHome} />;
      <Route path="/home" component={HomePage} />;
      <Route path="/login" component={Login} />;
      <Route path="/registration" component={Registration} />;
      <Route path="/exhibits/" component={Exhibits} />;
      <Route path="/shows" component={Shows} />;
      <Route path="/animals" component={Animals} />;
      <Route path="/exhibit_history" component={ExhibitHistory} />;
      <Route path="/shows_history" component={ShowHistory} />;
      <Route path="/exhibit_id" component={ExhibitDetail} />;
      <Route path="/animaldetail" component={AnimalDetail} />;
      <Route path="/assigned/shows" component={AssignedShows} />;
      <Route path="/addanimal" component={AddAnimal} />;
      <Route path="/addshow" component={AddShow} />;
    </Switch>
  );
};

export default Routes;
