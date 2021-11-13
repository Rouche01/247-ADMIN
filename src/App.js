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

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path={LOGIN_PAGE} component={Login} />
          <Route path={OVERVIEW_PAGE} component={Overview} />
          <Route path={ADVERTISERS_PAGE} component={Advertisers} />
          <Route path={DRIVERS_PAGE} component={Drivers} />
          <Route path={CAMPAIGN_PAGE} component={Campaign} />
          <Route path={AD_PLAYLIST} component={AdPlaylists} />
          <Route path={NOTIF_PAGE} component={SendNotifs} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
