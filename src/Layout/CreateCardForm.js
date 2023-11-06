import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import Navigation from "./Navigation";

import { createCard, readCard, updateCard, readDeck } from "../utils/api";

export default function CreateCardForm() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deck, setDeck] = useState(null);
  const history = useHistory();
  const { deckId, cardId } = useParams();
  const { path } = useRouteMatch();
  const isEdit = path.includes("edit");

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
  };

  // data fetcher for deck.
  useEffect(() => {
    // run this flow only when form is not submitted.
    if (!submitted) {
      const abortController = new AbortController();
      const read = async () => {
        try {
          setDeck(await readDeck(deckId, abortController.signal));
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        }
      };
      read();
      return () => abortController.abort();
    }
  }, [submitted, deckId]);

  // data fetcher for card.
  useEffect(() => {
    // run this flow only for edit and only when form is not submitted.
    if (isEdit && !submitted) {
      const abortController = new AbortController();
      const read = async () => {
        try {
          const { front, back } = await readCard(
            cardId,
            abortController.signal
          );
          setFront(front);
          setBack(back);
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        }
      };
      read();
      return () => abortController.abort();
    }
  }, [submitted, isEdit, cardId]);

  // record creation
  useEffect(() => {
    if (submitted && !isEdit) {
      const abortController = new AbortController();
      const create = async () => {
        try {
          await createCard(
            deckId,
            {
              front,
              back,
            },
            abortController.signal
          );
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setIsLoading(false);
          setSubmitted(false);
          setFront("");
          setBack("");
        }
      };
      create();
      return () => abortController.abort();
    }
  }, [front, back, submitted, history, isEdit, deckId]);

  // record update
  useEffect(() => {
    if (submitted && isEdit) {
      const abortController = new AbortController();
      const create = async () => {
        try {
          await updateCard(
            {
              front,
              back,
              id: Number(cardId),
              deckId: Number(deckId),
            },
            abortController.signal
          );
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setIsLoading(false);
          setSubmitted(false);
          setFront("");
          setBack("");
          history.goBack();
        }
      };
      create();
      return () => abortController.abort();
    }
  }, [front, back, submitted, history, isEdit, deckId, cardId]);

  if (deck) {
    return (
      <section className="form-page direct-child-container">
        <Navigation
          prevPages={[
            { name: "Home", link: "/" },
            { name: `${deck.name}`, link: `/decks/${deckId}` },
          ]}
          currentPage={isEdit ? `Edit Card ${cardId}` : "Add Card"}
        />
        {/* modify prevPages based on edit or create*/}
        <article className="form-container">
          <h2>{isEdit ? `${deck.name}: Edit card ${cardId}` : `${deck.name}: Add Card`}</h2>
          <hr />
          <form onSubmit={submitHandler}>
            <div className="front">
              <h3>
                <label htmlFor="front">Front</label>
              </h3>
              <textarea
                onChange={(event) => {
                  setFront(event.target.value);
                }}
                name="front"
                value={front}
                required={true}
                maxLength={150}
              ></textarea>
              <p style={{ textAlign: "right", color: "blue", fontSize: "12px" }}>
                <i>{front.length} / 150 characters.</i>
              </p>
            </div>
            <div className="back">
              <h3>
                <label htmlFor="back">Back</label>
              </h3>
              <textarea
                onChange={(event) => {
                  setBack(event.target.value);
                }}
                name="back"
                value={back}
                required={true}
                maxLength={150}
              ></textarea>
              <p style={{ textAlign: "right", color: "blue", fontSize: "12px" }}>
                <i>{back.length} / 150 characters.</i>
              </p>
            </div>
            { isEdit ? (<div className="footer">
              <button type="submit" className="purple-btn" disabled={isLoading}>
                Save
              </button>
              <button
                className="red-btn"
                onClick={() => history.goBack() /* updated based on isEdit*/}
                disabled={isLoading}
                type="button"
              >
                Cancel
              </button>
            </div>) : (
              <div className="footer">
              <button type="submit" className="purple-btn" disabled={isLoading}>
                Save
              </button>
              <button
                className="red-btn"
                onClick={() => history.goBack() /* updated based on isEdit*/}
                disabled={isLoading}
                type="button"
              >
                Done
              </button>
            </div>
            )}
            
          </form>
        </article>
      </section>
    );
  }
  return <div></div>;
}
