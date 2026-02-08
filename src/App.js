import React, { useState, useMemo } from 'react';
import cardsData from './data/cards.json';
import Card from './components/Card';
import Carousel from './components/Carousel';
import './styles/main.css';

export default function App() {
  const cards = Array.isArray(cardsData) ? cardsData : [];
  const [index, setIndex] = useState(0);

  // random positions for scattered thumbnails (stable for the session)
  const scatter = useMemo(
    () =>
      cards.map(() => {
        return {
          top: `${10 + Math.random() * 70}%`,
          left: `${5 + Math.random() * 90}%`,
          rotate: `${-12 + Math.random() * 24}deg`,
          scale: 0.6 + Math.random() * 0.6
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNext = () => setIndex((i) => Math.min(i + 1, cards.length));
  const handlePrev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="app-root">
      <Carousel />
      {/* scattered thumbnails behind */}
      <div className="scatter-layer" aria-hidden="true">
        {cards.map((c, i) => (
          <div
            key={i}
            className="scatter-card"
            style={{
              top: scatter[i]?.top,
              left: scatter[i]?.left,
              transform: `rotate(${scatter[i]?.rotate}) scale(${scatter[i]?.scale})`
            }}
          >
            <strong>{c.title}</strong>
          </div>
        ))}
      </div>

      {/* centered popup modal for the current card */}
      <div className="modal-backdrop">
        <div className="modal-center">
          {index < cards.length ? (
            <Card data={cards[index]} onNext={handleNext} onPrev={handlePrev} isLast={index === cards.length - 1} />
          ) : (
            <div className="final-card">
              <h2>All done ❤️</h2>
              <p>Will you be my Valentine?</p>
              <div className="controls">
                <button onClick={() => setIndex(0)}>Start Again</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}