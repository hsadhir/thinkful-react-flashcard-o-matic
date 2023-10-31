import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../Navigation";
import DeckDescription from "./DeckDescription";
import CardsHeader from "./CardsHeader";
import CardsContainer from "./CardsContainer";

import { readDeck, deleteCard } from "../../utils/api";

export default function ViewDeck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState(null);

  const deleteCardHandler = (event) => {
    const targetCard = event.target.closest(".flashcard");
    const targetCardId = Number(targetCard.id);

    const userAction = window.confirm(
      `Do you want to delete this card?\n\nYou will not be able to recover it.`
    );

    if (userAction) {
      setCardIdToDelete(targetCardId); // Update the state with the deck ID
    }
  };

  // delete card
  useEffect(() => {
    if (cardIdToDelete) {
      const abortController = new AbortController();
      const deleteCardById = async () => {
        try {
          await deleteCard(cardIdToDelete, abortController.signal);
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setCardIdToDelete(null); // Reset deckIdToDelete after the delete operation
          // location.href="/";
        }
      };
      deleteCardById();
      return () => abortController.abort();
    }
  }, [cardIdToDelete]);

  // get deck data
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
  }, [deckId, cardIdToDelete]);

  if (loading) return <p>Loading...</p>;

  if (deck) {
    return (
      <section>
        <Navigation
          prevPages={[{ name: "Home", link: "/" }]}
          currentPage={deck.name}
        />
        <DeckDescription deck={deck} />
        <hr />
        <CardsHeader deckId={deckId} />
        <CardsContainer deckId={deckId} cards={deck.cards} deleteHandler={deleteCardHandler} />
      </section>
    );
  }

  return <div></div>;
}
