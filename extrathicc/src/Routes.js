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
import { Redirect } from "react-router-dom";
import UserContext from "./UserContext.js";

const AuthRoute = ({ component: Component, ...rest }) => (
    <UserContext.Consumer>
        {({ loggedIn }) => (
            <Route
                {...rest}
                render={props =>
                    loggedIn ? (
                        <Component {...props} />
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: { from: props.location }
                                }}
                            />
                        )
                }
            />
        )}
    </UserContext.Consumer>
);

const Routes = () => {
    return (
        <Switch>
            <AuthRoute path="/staffhome" component={StaffHome} />;
            <AuthRoute path="/adminhome" component={AdminHome} />;
            <AuthRoute path="/visitorhome" component={HomePage} />;
            <Route path="/login" component={Login} />;
            <Route path="/registration" component={Registration} />;
            <AuthRoute path="/exhibits/" component={Exhibits} />;
            <AuthRoute path="/shows" component={Shows} />;
            <AuthRoute path="/animals" component={Animals} />;
            <AuthRoute path="/exhibit_history" component={ExhibitHistory} />;
            <AuthRoute path="/shows_history" component={ShowHistory} />;
            <AuthRoute path="/exhibit_id" component={ExhibitDetail} />;
            <AuthRoute path="/animaldetail/:name/:species" component={AnimalDetail} />;
            <AuthRoute path="/assigned/shows" component={AssignedShows} />;
            <AuthRoute path="/addanimal" component={AddAnimal} />;
            <AuthRoute path="/addshow" component={AddShow} />;
        </Switch>
    );
};

export default Routes;
