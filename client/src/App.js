import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Result from "./components/Result";
import { fetchUtils, Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import authProvider from "./utils/authProvider";
import Login from "./containers/Login";
import Menu from "./containers/Menu";

import Dashboard from "./Dashboard";
import Vote from "./components/Vote";

const fetchJson = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  // add your own headers here
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider("http://localhost:3001", fetchJson);

const App = () => {
  return (
    <div className="App">
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/sign-up"}>
              S-Vote
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>
                    Sign in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>
                    Sign up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/result"}>
                    Result
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="outer">
          <Switch>
            <Route exact path="/" component={Register} />
            <Route path="/sign-in">
              <Admin
                menu={Menu}
                dashboard={Dashboard}
                loginPage={Login}
                authProvider={authProvider}
                dataProvider={dataProvider}
              >
                <Resource />
              </Admin>
            </Route>
            <Route path="/sign-up" component={Register} />
            <Route path="/result" component={Result} />
            <Route path="/vote" component={Vote} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
