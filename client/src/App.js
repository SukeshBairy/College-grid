import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import TeacherRoom from "./components/TeacherRoom";
import TeacherNotes from "./components/TeacherNotes";
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Student/Dashboard/Dashboard";
import Home from "./components/Student/Home/Home";
import Notes from "./components/Student/Notes/Notes";
import Assessment from "./components/Student/Assessment/Assessment";
import Room from "./components/Student/Room/Room";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./PrivateRoute";

import store from "./store";
import { Provider } from "react-redux";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/login" />
            </Route>
            <Route path="/login">
              <Login />
            </Route>

            <Route exact path="/room" component={CreateRoom} />
            <Route exact path="/notes" component={TeacherNotes} />
            <Route exact path="/:roomID" component={TeacherRoom} />

            <PrivateRoute
              exact
              path="/student/dashboard"
              component={Dashboard}
            />
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
