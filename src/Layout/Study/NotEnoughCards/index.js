import React from "react";
import { Link } from "react-router-dom/";

import "./NotEnoughCards.css";

function NotEnoughCards({ deckId, cardsCount }) {
  return (
    <div className="not-enough-cards">
      <h2>Not Enough Cards</h2>
      <p>You need atleast 3 cards to study. You have {cardsCount} cards.</p>
      <p>
        <Link to={`/decks/${deckId}/cards/new`} className="black-btn">
          Add Card
        </Link>
      </p>
    </div>
  );
}

export default NotEnoughCards;
