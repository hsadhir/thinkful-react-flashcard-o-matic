import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { readDeck } from "../../utils/api";
import Navigation from "../Navigation";
import NotEnoughCards from "./NotEnoughCards";
import StudyDeck from "./StudyDeck";

export default function Study() {
  const { deckId } = useParams();
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const read = async () => {
      try {
        setDeck(await readDeck(deckId, abortController.signal));
      } catch (error) {
        if (error.name === "AbortError") console.log("Aborted..");
        else throw error;
      } finally {
        setLoading(false);
      }
    };
    read();
    return () => abortController.abort();
  }, [deckId]);

  if (loading) {
    return (
      <section className="direct-child-container">
        <p>Loading...</p>
      </section>
    );
  }

  if (deck) {
    const { cards } = deck;
    return (
      <div>
        <Navigation
          prevPages={[
            { name: "Home", link: "/" },
            { name: `${deck.name}`, link: `/decks/${deckId}` },
          ]}
          currentPage="Study"
        />
        <section className="direct-child-container">
          {cards.length >= 3 ? (
            <StudyDeck deck={deck} cards={cards} />
          ) : (
            <NotEnoughCards deckId={deckId} cardsCount={cards.length} />
          )}
        </section>
      </div>
    );
  }
  return <div></div>;
}
