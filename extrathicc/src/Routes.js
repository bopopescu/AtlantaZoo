import Login from "./js/Login";
import Registration from "./js/Registration";
import { Switch, Route } from "react-router-dom";
import React from "react";
import HomePage from "./js/HomePages/HomePage";
import Exhibits from "./js/Exhibit/Exhibits";
import ExhibitHistory from "./js/Exhibit/ExhibitHistory";
import ExhibitDetail from "./js/Exhibit/ExhibitDetail";
import AnimalDetail from "./js/Animal/AnimalDetail";
import ShowHistory from "./js/Show/ShowHistory";
import Shows from "./js/Show/Shows";
import Animals from "./js/Animal/Animals";
import AssignedShows from "./js/Show/AssignedShows";
import StaffHome from "./js/HomePages/StaffHome";
import AdminHome from "./js/HomePages/AdminHome";
import AddAnimal from "./js/Animal/AddAnimal";
import AddShow from "./js/Show/AddShow";
import { Redirect } from "react-router-dom";
import UserContext from "./UserContext.js";

const AuthRoute = ({ component: Component, requiredUserType, ...rest }) => (
    <UserContext.Consumer>
        {({ email, userType, loggedIn, checkedLogin }) => (
            <Route
                {...rest}
                render={props => {
                    if (!checkedLogin) {
                        return (<div/>);
                    }
                    if (loggedIn) {
                        if (requiredUserType && requiredUserType !== userType) {
                            return (<Redirect
                                to={{
                                    pathname: "/",
                                    state: {from: props.location}
                                }}
                            />);
                        }
                        return (
                            <Component {...props} />
                        );
                    } else {
                        return (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: {from: props.location}
                                }}
                            />
                        );
                    }
                }}
            />
        )}
    </UserContext.Consumer>
);

const Routes = () => {
    return (
        <Switch>
            <AuthRoute path="/staffhome" component={StaffHome} requiredUserType="Staff"/>;
            <AuthRoute path="/adminhome" component={AdminHome} requiredUserType="Admin"/>;
            <AuthRoute path="/visitorhome" component={HomePage} requiredUserType="Visitor"/>;
            <Route path="/login" component={Login} />;
            <Route path="/registration" component={Registration} />;
            <AuthRoute path="/exhibits/" component={Exhibits} />;
            <AuthRoute path="/shows" component={Shows} />;
            <AuthRoute path="/animals" component={Animals} />;
            <AuthRoute path="/exhibit_history" component={ExhibitHistory} />;
            <AuthRoute path="/shows_history" component={ShowHistory} />;
            <AuthRoute path="/exhibitdetail/:name" component={ExhibitDetail} />;
            <AuthRoute path="/animaldetail/:name/:species" component={AnimalDetail} />;
            <AuthRoute path="/assignedshows" component={AssignedShows} requiredUserType="Visitor"/>;
            <AuthRoute path="/addanimal" component={AddAnimal} />;
            <AuthRoute path="/addshow" component={AddShow} />;
        </Switch>
    );
};

export default Routes;
