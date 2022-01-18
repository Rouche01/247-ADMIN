import React, { useContext } from "react";
import { Route, useLocation, Redirect } from "react-router-dom";
import { Context as AuthContext } from "../context/AuthContext";
import { LOGIN_PAGE } from "./pageUrls";

const ProtectedRoute = ({ component: Component, userType, ...rest }) => {
  const {
    state: { user, loggedIn },
  } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Route {...rest}>
      {loggedIn && user?.kind.toLowerCase() === userType ? (
        <Component />
      ) : (
        <Redirect
          to={{ pathname: LOGIN_PAGE, state: { from: location, userType } }}
        />
      )}
    </Route>
  );
};

export default ProtectedRoute;
