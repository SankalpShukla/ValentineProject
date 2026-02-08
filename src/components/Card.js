import React, { useEffect, useState } from 'react';

export default function Card({ data = {}, onNext = () => {}, onClose = () => {} }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [data]);

  const title = data.title ?? 'Untitled';
  const text = data.text ?? data.message ?? 'A little message from me to you.';

  return (
    <div className={`popup-card ${visible ? 'visible' : ''}`} role="dialog" aria-modal="true">
      <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
      <h3>{title}</h3>
      <p>{text}</p>

      <div className="controls">
        <button onClick={onNext} className="next-text">Next -&gt;</button>
      </div>
    </div>
  );
}