import React from "react";
import { Link } from "react-router-dom";

export default function CardsHeader({ deckId }) {
  return (
    <section className="page-header direct-child-container">
      <h3>Cards</h3>
      <p>
        <Link
          to={`/decks/${deckId}/cards/new`}
          className="black-btn"
        >
          Add Card
        </Link>
      </p>
    </section>
  );
}
