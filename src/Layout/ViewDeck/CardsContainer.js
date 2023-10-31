import React from "react";
import { useHistory } from "react-router-dom";

import "./CardsContainer.css";

export default function CardsContainer({ deckId, cards, deleteHandler }) {
  const history = useHistory();
  if (cards.length) {
    return (
      <section className="card-container">
        {cards.map((card, index) => (
          <article key={index} className="flashcard card" id={card.id}>
            <div className="body">
              <div className="front gradient-border-left">
                <h3>Front</h3>
                <p>{card.front}</p>
              </div>
              <div className="back gradient-border-right">
                <h3>Back</h3>
                <p>{card.back}</p>
              </div>
            </div>
            <div className="footer">
              <button
                className="blue-btn"
                onClick={() =>
                  history.push(`/decks/${deckId}/cards/${card.id}/edit`)
                }
              >
                Edit
              </button>
              <button className="red-btn" onClick={deleteHandler}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    );
  }
  return <div className="direct-child-container"><p>No Cards to Show.</p></div>
}
