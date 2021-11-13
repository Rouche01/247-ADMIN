import "./App.css";
import { Switch, Router, Route } from "react-router-dom";
import {
  ADVERTISERS_PAGE,
  LOGIN_PAGE,
  OVERVIEW_PAGE,
} from "../src/routes/pageUrls";
import Login from "./pages/Login";
import history from "./utils/history";
import Overview from "./pages/Overview";
import Advertisers from "./pages/Advertisers";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path={LOGIN_PAGE} component={Login} />
          <Route path={OVERVIEW_PAGE} component={Overview} />
          <Route path={ADVERTISERS_PAGE} component={Advertisers} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
