import React from "react";
import { Link } from "react-router-dom";

export default function HomePageHeader() {
  return (
    <section className="page-header direct-child-container">
      <h2>Decks</h2>
      <p><Link to="/decks/new" className="black-btn">Create New Deck</Link></p>
    </section>
  );
}
