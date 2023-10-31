import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { listDecks, deleteDeck } from "../../utils/api";

export default function Decks() {
  const history = useHistory();
  const [deckData, setDeckData] = useState([]);
  const [deckIdToDelete, setDeckIdToDelete] = useState(0);
  const [loading, setLoading] = useState(true);

  const deleteHandler = (event) => {
    const targetDeck = event.target.closest(".deck");
    const deckId = Number(targetDeck.id);

    const userAction = window.confirm(
      `Do you want to delete this deck?\n\nYou will not be able to recover it.`
    );

    if (userAction) {
      setDeckIdToDelete(deckId); // Update the state with the deck ID
    }
  };

  const viewHandler = (event) => {
    const deckId = Number(event.target.closest(".deck").id);
    history.push(`/decks/${deckId}`);
  };

  const studyHandler = (event) => {
    const deckId = Number(event.target.closest(".deck").id);
    history.push(`/decks/${deckId}/study`);
  };

  useEffect(() => {
    setDeckData([]);
    setLoading(true);
    const abortController = new AbortController();
    const loadDecks = async () => {
      try {
        const response = await listDecks(abortController.signal);
        setDeckData(response);
      } catch (error) {
        if (error.name === "AbortError") console.log("Aborted..");
        else throw error;
      } finally {
        setLoading(false);
      }
    };
    loadDecks();
    return () => abortController.abort();
  }, [deckIdToDelete]);

  useEffect(() => {
    if (deckIdToDelete > 0) {
      // Check if deckIdToDelete is greater than 0
      const abortController = new AbortController();
      const deleteDeckById = async () => {
        try {
          await deleteDeck(deckIdToDelete, abortController.signal);
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setDeckIdToDelete(0); // Reset deckIdToDelete after the delete operation
          // location.href="/";
        }
      };
      deleteDeckById();
      return () => abortController.abort();
    }
  }, [deckIdToDelete]);

  if (deckData.length === 0 && !loading) {
    return (
      <div className="direct-child-container"><p>No Decks to Show.</p></div>
    );
  }

  if (loading) {
    return (
      <section className="decks">
        <p>Decks Loading....Please be patient...</p>
      </section>
    );
  }

  return (
    <section className="card-container decks">
      {deckData.map(({ id, name, description, cards }, index) => (
        <article key={index} className="deck card" id={id}>
          <div className="header">
            <h3>{name}</h3>
            <p>{cards.length} cards</p>
          </div>
          <div className="body">
            <p>{description}</p>
          </div>
          <div className="footer">
            <button className="purple-btn" onClick={viewHandler}>
              View
            </button>
            <button className="green-btn" onClick={studyHandler}>
              Study
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
