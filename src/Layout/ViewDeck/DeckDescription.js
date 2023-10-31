import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { deleteDeck } from "../../utils/api";

import "./DeckDescription.css";

export default function DeckDescription({ deck }) {
  const history = useHistory();
  const [isDelete, setIsDelete] = useState(false);

  const deleteHandler = () => {
    const userAction = window.confirm(
      `Do you want to delete this deck?\n\nYou will not be able to recover it.`
    );

    if (userAction) {
      setIsDelete(true); // Update the state with the deck ID
    }
  };

  useEffect(() => {
    if (isDelete) {
      // Check if deckIdToDelete is greater than 0
      const abortController = new AbortController();
      const deleteDeckById = async () => {
        try {
          await deleteDeck(deck.id, abortController.signal);
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setIsDelete(false); // Reset deckIdToDelete after the delete operation
          history.push("/");
        }
      };
      deleteDeckById();
      return () => abortController.abort();
    }
  }, [isDelete, history, deck.id]);

  return (
    <section>
      <section className="page-header direct-child-container">
        <h2>{deck.name}</h2>
        <div>
          <button
            onClick={() => history.push(`/decks/${deck.id}/edit`)}
            className="blue-btn"
          >
            Edit Deck
          </button>
          <button
            onClick={() => history.push(`/decks/${deck.id}/study`)}
            className="green-btn"
          >
            Study
          </button>
          <button onClick={deleteHandler} className="red-btn">
            Delete Deck
          </button>
        </div>
      </section>
      <section id="deck-description" className="direct-child-container">
        <p>{deck.description}</p>
      </section>
    </section>
  );
}
