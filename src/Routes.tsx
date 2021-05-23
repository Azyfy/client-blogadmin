import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import Posts from "./components/Posts";

const Routes: any = () => {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/posts" component={Posts} />
        </Switch>
      </Router>
    );
  };
  
  export default Routes;