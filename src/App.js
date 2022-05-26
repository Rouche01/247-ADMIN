import "./App.css";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import {
  ADVERTISERS_PAGE,
  ADVERTISER_DETAIL_PAGE,
  CAMPAIGN_DETAIL_PAGE,
  CAMPAIGN_PAGE,
  CONTENT_LIBRARY,
  DRIVERS_PAGE,
  LOGIN_PAGE,
  NOTIF_PAGE,
  OVERVIEW_PAGE,
  PENDING_PAYOUTS,
  PLAYLIST_MANAGER,
  QUIZ_CENTRE,
} from "../src/routes/pageUrls";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Advertisers from "./pages/Advertisers";
import AdvertiserDetail from "./pages/AdvertiserDetail";
import Drivers from "./pages/Drivers";
import Campaign from "./pages/Campaign";
import CampaignDetail from "./pages/CampaignDetail";
import SendNotifs from "./pages/SendNotifs";
import ContentLibrary from "./pages/ContentLibrary";
import PlaylistManager from "./pages/PlaylistManager";
import QuizCentre from "./pages/QuizCentre";
import PendingPayouts from "./pages/PendingPayouts";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();
  console.log(location);
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to={{ pathname: LOGIN_PAGE, state: { from: location } }} />
        </Route>
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
          path={ADVERTISER_DETAIL_PAGE}
          userType="admin"
          component={AdvertiserDetail}
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
          path={CAMPAIGN_DETAIL_PAGE}
          userType="admin"
          component={CampaignDetail}
        />
        <ProtectedRoute
          path={NOTIF_PAGE}
          exact
          userType="admin"
          component={SendNotifs}
        />
        <ProtectedRoute
          path={CONTENT_LIBRARY}
          exact
          userType="admin"
          component={ContentLibrary}
        />
        <ProtectedRoute
          path={PLAYLIST_MANAGER}
          exact
          userType="admin"
          component={PlaylistManager}
        />
        <ProtectedRoute
          path={QUIZ_CENTRE}
          exact
          userType="admin"
          component={QuizCentre}
        />
        <ProtectedRoute
          path={PENDING_PAYOUTS}
          exact
          userType="admin"
          component={PendingPayouts}
        />
      </Switch>
    </div>
  );
}

export default App;
