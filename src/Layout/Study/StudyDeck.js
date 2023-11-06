import { useState } from "react";

import "./StudyDeck.css";

export default function StudyDeck({ deck, cards }) {
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

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Study: {deck.name}</h2>
      <div className="study-container">
        <h3>
          Card {curr + 1} of {cards.length}
        </h3>
        <div className={`${back ? "back-display" : "front-display"}`}>
          {back ? <p>{cards[curr].back}</p> : <p>{cards[curr].front}</p>}
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
  );
}
