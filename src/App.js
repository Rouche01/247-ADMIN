import "./App.css";
import { Switch, Router, Route } from "react-router-dom";
import {
  ADVERTISERS_PAGE,
  AD_PLAYLIST,
  CAMPAIGN_PAGE,
  DRIVERS_PAGE,
  LOGIN_PAGE,
  NOTIF_PAGE,
  OVERVIEW_PAGE,
} from "../src/routes/pageUrls";
import Login from "./pages/Login";
import history from "./utils/history";
import Overview from "./pages/Overview";
import Advertisers from "./pages/Advertisers";
import Drivers from "./pages/Drivers";
import Campaign from "./pages/Campaign";
import AdPlaylists from "./pages/AdPlaylists";
import SendNotifs from "./pages/SendNotifs";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path={LOGIN_PAGE} component={Login} />
          <ProtectedRoute
            exact
            userType="admin"
            path={OVERVIEW_PAGE}
            component={Overview}
          />
          <ProtectedRoute
            path={ADVERTISERS_PAGE}
            exact
            userType="admin"
            component={Advertisers}
          />
          <ProtectedRoute
            path={DRIVERS_PAGE}
            exact
            userType="admin"
            component={Drivers}
          />
          <ProtectedRoute
            path={CAMPAIGN_PAGE}
            exact
            userType="admin"
            component={Campaign}
          />
          <ProtectedRoute
            path={AD_PLAYLIST}
            exact
            userType="admin"
            component={AdPlaylists}
          />
          <ProtectedRoute
            path={NOTIF_PAGE}
            exact
            userType="admin"
            component={SendNotifs}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
