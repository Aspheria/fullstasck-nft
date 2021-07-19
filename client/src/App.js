import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NftListing from "./containers/NftListing";
import Header from "./containers/Header";
import "./App.css";
import NftDetails from "./containers/NftDetails";


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={NftListing} />
          <Route path="/nft/:nftId" component={NftDetails} />
          <Route>404 Not Found!</Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
