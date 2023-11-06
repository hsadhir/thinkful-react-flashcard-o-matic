import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { readDeck } from "../../utils/api";
import Navigation from "../Navigation";
import NotEnoughCards from "./NotEnoughCards";

import "./Study.css";

export default function Study() {
  const { deckId } = useParams();
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);

  const [back, setBack] = useState(false);
  const [curr, setCurr] = useState(0);

  const nextHandler = () => {
    const totalCards = deck.cards.length;
    if (curr === totalCards - 1) {
      const userAction = window.confirm(`Restart Cards ?`);

      if (userAction) {
        setCurr(0);
        setBack(!back);
      }
    } else {
      setCurr((curr) => curr + 1);
      setBack(!back);
    }
  };

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
            <div>
              <h2 style={{ textAlign: "center" }}>Study: {deck.name}</h2>
              <div className="study-container">
                <h3>
                  Card {curr + 1} of {cards.length}
                </h3>
                <div className={`${back ? "back-display" : "front-display"}`}>
                  {back ? (
                    <p>{cards[curr].back}</p>
                  ) : (
                    <p>{cards[curr].front}</p>
                  )}
                </div>
                <div className="study-actions">
                  {back && curr > 0 && (
                    <button
                      className="purple-btn"
                      onClick={() => {
                        setCurr((curr) => curr - 1);
                        setBack(!back);
                      }}
                    >
                      Previous
                    </button>
                  )}
                  <button className="blue-btn" onClick={() => setBack(!back)}>
                    Flip
                  </button>
                  {back && (
                    <button className="green-btn" onClick={nextHandler}>
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <NotEnoughCards deckId={deckId} cardsCount={cards.length} />
          )}
        </section>
      </div>
    );
  }
  return <div></div>;
}
