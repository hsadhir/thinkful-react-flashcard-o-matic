import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import Navigation from "./Navigation";

import { createDeck, readDeck, updateDeck } from "../utils/api";

export default function CreateDeckForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const { deckId } = useParams();
  const { path } = useRouteMatch();
  const isEdit = path.includes("edit");

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
  };

  // data fetcher
  useEffect(() => {
    // run this flow only for edit and only when form is not submitted.
    if (isEdit && !submitted) {
      const abortController = new AbortController();
      const read = async () => {
        try {
          const { name, description } = await readDeck(
            deckId,
            abortController.signal
          );
          setName(name);
          setDescription(description);
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        }
      };
      read();
      return () => abortController.abort();
    }
  }, [submitted, isEdit, deckId]);

  // record creation
  useEffect(() => {
    if (submitted && !isEdit) {
      const abortController = new AbortController();
      const create = async () => {
        try {
          await createDeck(
            {
              name,
              description,
            },
            abortController.signal
          );
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setIsLoading(false);
          setSubmitted(false);
          setName("");
          setDescription("");
          history.push("/");
        }
      };
      create();
      return () => abortController.abort();
    }
  }, [name, description, submitted, history, isEdit]);

  // record update
  useEffect(() => {
    if (submitted && isEdit) {
      const abortController = new AbortController();
      const create = async () => {
        try {
          await updateDeck(
            {
              name,
              description,
              id: deckId,
            },
            abortController.signal
          );
        } catch (error) {
          if (error.name === "AbortError") console.log("Aborted..");
          else throw error;
        } finally {
          setIsLoading(false);
          setSubmitted(false);
          setName("");
          setDescription("");
          history.goBack();
        }
      };
      create();
      return () => abortController.abort();
    }
  }, [name, description, submitted, history, isEdit, deckId]);

  return (
    <section className="form-page direct-child-container">
      <Navigation
        prevPages={
          isEdit
            ? [
                { name: "Home", link: "/" },
                { name, link: `/decks/${deckId}` },
              ]
            : [{ name: "Home", link: "/" }]
        }
        currentPage={isEdit ? "Edit Deck" : "Create Deck"}
      />{" "}
      {/* modify prevPages based on edit or create*/}
      <article className="form-container">
        <h2>{isEdit ? `Edit Deck (#${deckId})` : "Create Deck"}</h2>
        <hr />
        <form onSubmit={submitHandler}>
          <div className="name">
            <h3>
              <label htmlFor="name">Name</label>
            </h3>
            <input
              onChange={(event) => {
                setName(event.target.value);
              }}
              name="name"
              type="text"
              value={name}
              required={true}
              maxLength={30}
            />
            <p style={{ textAlign: "right", color: "blue", fontSize: "12px" }}>
              <i>{name.length} / 30 characters.</i>
            </p>
          </div>
          <div className="description">
            <h3>
              <label htmlFor="description">Description</label>
            </h3>
            <textarea
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              name="description"
              value={description}
              required={true}
              maxLength={150}
            ></textarea>
            <p style={{ textAlign: "right", color: "blue", fontSize: "12px" }}>
              <i>{description.length} / 150 characters.</i>
            </p>
          </div>
          <div className="footer">
            <button type="submit" className="purple-btn" disabled={isLoading}>
              Submit
            </button>
            <button
              className="red-btn"
              onClick={() => history.goBack() /* updated based on isEdit*/}
              disabled={isLoading}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
