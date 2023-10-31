import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import CreateDeckForm from "./CreateDeckForm";
import CreateCardForm from "./CreateCardForm";
import ViewDeck from "./ViewDeck";
import Study from "./Study";

function Layout() {
  return (
    <div>
      <Header />
      <main id="parent-container" className="container">
        {/* TODO: Implement the screen starting here */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/decks">
            <Home />
          </Route>
          <Route exact path="/decks/new">
            <CreateDeckForm />
          </Route>
          <Route path="/decks/:deckId/edit">
            <CreateDeckForm />
          </Route>
          <Route exact path="/decks/:deckId">
            <ViewDeck />
          </Route>
          <Route path="/decks/:deckId/study">
            <Study />
          </Route>
          <Route path="/decks/:deckId/cards/new">
            <CreateCardForm />
          </Route>
          <Route path="/decks/:deckId/cards/:cardId/edit">
            <CreateCardForm />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default Layout;
