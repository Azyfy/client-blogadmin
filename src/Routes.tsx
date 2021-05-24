import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";
import Posts from "./components/Posts";
import SinglePost from "./components/SinglePost";
import NewPost from "./components/NewPost";

const Routes: any = () => {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/posts" component={Posts} />
          <Route exact path="/posts/new" component={NewPost} />
          <Route path="/posts/:id" component={SinglePost} />
        </Switch>
      </Router>
    );
  };
  
  export default Routes;