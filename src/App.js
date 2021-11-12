import "./App.css";
import { Switch, Router, Route } from "react-router-dom";
import { LOGIN_PAGE, OVERVIEW_PAGE } from "../src/routes/pageUrls";
import Login from "./pages/Login";
import history from "./utils/history";
import Overview from "./pages/Overview";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path={LOGIN_PAGE} component={Login} />
          <Route path={OVERVIEW_PAGE} component={Overview} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
