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
import AnimalCare from "./js/Animal/AnimalCare";
import Visitors from "./js/Users/Vistors";
import Staffs from "./js/Users/Staffs";

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
                        if (requiredUserType && requiredUserType.toLowerCase() !== userType.toLowerCase()) {
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
            <AuthRoute path="/exhibits" component={Exhibits} />;
            <AuthRoute path="/visitors" component={Visitors} />;
            <AuthRoute path="/staff" component={Staffs} />;
            <AuthRoute path="/shows" component={Shows} />;
            <AuthRoute path="/animals" component={Animals} />;
            <AuthRoute path="/exhibit_history" component={ExhibitHistory} />;
            <AuthRoute path="/show_history" component={ShowHistory} />;
            <AuthRoute path="/exhibitdetail/:name" component={ExhibitDetail} />;
            <AuthRoute path="/animaldetail/:name/:species" component={AnimalDetail} />;
            <AuthRoute path="/assignedshows" component={AssignedShows} requiredUserType="Staff"/>;
            <AuthRoute path="/animalcare/:name/:species" component={AnimalCare} requiredUserType="Staff"/>;
            <AuthRoute path="/addanimal" component={AddAnimal} requiredUserType="Admin"/>;
            <AuthRoute path="/addshow" component={AddShow} requiredUserType="Admin"/>;
        </Switch>
    );
};

export default Routes;
