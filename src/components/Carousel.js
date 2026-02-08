import React, { useEffect, useRef } from 'react';
import './Carousel.css'; // keep simple structural styles

export default function Carousel() {
  const imgs = Array.from({ length: 20 }, (_, i) => `/assets/images/image${i + 1}.jpeg`);

  // duplicate items so animation looks continuous
  const items = [...imgs, ...imgs];

  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const computeShift = () => {
      // Half the scroll width (since items are duplicated) is the distance to shift
      const shift = track.scrollWidth / 2;
      track.style.setProperty('--scroll-shift', `${shift}px`);
    };

    computeShift();
    window.addEventListener('resize', computeShift);
    return () => window.removeEventListener('resize', computeShift);
  }, []);

  return (
    <div className="carousel" aria-hidden="true">
      <div className="carousel-track" ref={trackRef}>
        {items.map((src, idx) => (
          <div
            key={idx}
            className="carousel-item"
            style={{ backgroundImage: `url("${src}")` }}
          />
        ))}
      </div>
    </div>
  );
}