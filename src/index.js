import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import Carousel from './components/Carousel';
import Card from './components/Card';
import cardsData from './data/cards.json';

// confetti launcher
function launchConfetti() {
  const count = 120;
  const colors = ['#ffd700','#ff6b6b','#7b1fa2','#6a5acd','#00d1b2','#ff8cb3'];
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const pieces = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    w: 8 + Math.random() * 10,
    h: 6 + Math.random() * 8,
    vx: -2 + Math.random() * 4,
    vy: 1 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let start = null;
  function frame(t) {
    if (!start) start = t;
    const dt = (t - start) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy + 0.5 * dt;
      p.vy += 0.02;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (t - start < 3000) {
      requestAnimationFrame(frame);
    } else {
      document.body.removeChild(canvas);
    }
  }
  requestAnimationFrame(frame);
}

const App = () => {
  const cards = Array.isArray(cardsData) && cardsData.length ? cardsData : [
    { title: 'Card 1', text: 'You make my world brighter.' },
    { title: 'Card 2', text: 'I love your smile and your laugh.' },
    { title: 'Card 3', text: 'Every day with you is my favorite day.' }
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(true);
  const [visited, setVisited] = useState(() => cards.map(() => false));
  const [goToClosePrompt, setGoToClosePrompt] = useState(false);
  const [finalPopupVisible, setFinalPopupVisible] = useState(false);
  const originalCount = cards.length;
  const fullCards = [...cards, { title: 'One more step', text: 'Please close the current popup for the big question.' , isClosePrompt: true }];
  const audioRef = useRef(null);
  const popupRef = useRef(null);
  const maybeRef = useRef(null);
  const [maybePos, setMaybePos] = useState(null);

  
  // configure audio element; playback starts only when user confirms final 'Yes'
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.9;
    audio.muted = false;
    // no autoplay or event listeners here
    return () => {
      try { audio.pause(); } catch (e) { }
    };
  }, []);

  useEffect(() => {
    if (currentCardIndex < originalCount) {
      setVisited((v) => {
        if (v[currentCardIndex]) return v;
        const next = [...v];
        next[currentCardIndex] = true;
        return next;
      });
    }
  }, [currentCardIndex, originalCount]);

  // when all original cards have been visited, set a flag so the next Next press
  // will navigate to the close-prompt card
  useEffect(() => {
    if (visited.every(Boolean)) {
      setGoToClosePrompt(true);
    }
  }, [visited]);

  const handleNext = () => {
    setCurrentCardIndex((i) => {
      // if all originals were visited and we're on the last original, go to the close-prompt
      if (goToClosePrompt && i === originalCount - 1) {
        setGoToClosePrompt(false);
        return originalCount;
      }
      return (i + 1) % fullCards.length;
    });
  };
  const handleCloseCards = () => setCardsVisible(false);
  const handleCloseCard = () => {
    // if we're on the extra close-prompt card, show the final popup when closed
    if (currentCardIndex === originalCount) {
      setCardsVisible(false);
      setFinalPopupVisible(true);
    } else {
      setCardsVisible(false);
    }
  };
  const handleShowCards = () => {
    setCardsVisible(true);
    setFinalPopupVisible(false);
  };
  

  const handleFinalYes = () => {
    launchConfetti();
    const audio = audioRef.current;
    if (!audio) return;
    const startSec = 109; // 1:49
    const playFrom = async (sec) => {
      try {
        if (audio.readyState > 0) {
          audio.currentTime = Math.min(sec, audio.duration || sec);
          await audio.play();
        } else {
          const onLoaded = async () => {
            try { audio.currentTime = Math.min(sec, audio.duration || sec); } catch (e) { }
            try { await audio.play(); } catch (e) { }
            audio.removeEventListener('loadedmetadata', onLoaded);
          };
          audio.addEventListener('loadedmetadata', onLoaded);
          // ensure the browser loads metadata
          try { audio.load(); } catch (e) { }
        }
      } catch (e) { /* ignore play errors */ }
    };
    playFrom(startSec);
  };

  const moveMaybe = () => {
    const popup = popupRef.current;
    const btn = maybeRef.current;
    if (!popup || !btn) return;
    const pRect = popup.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    const padding = 12;
    const headerAvoid = 80;

    const availableWidth = Math.max(pRect.width - bRect.width - padding * 2, 0);
    const availableHeight = Math.max(pRect.height - bRect.height - padding * 2 - headerAvoid, 0);
    const left = Math.round(padding + Math.random() * availableWidth);
    const top = Math.round(padding + headerAvoid + Math.random() * availableHeight);

    setMaybePos({ left, top });
  };

  useEffect(() => {
    if (finalPopupVisible) {
      requestAnimationFrame(() => moveMaybe());
    }
  }, [finalPopupVisible]);

  return (
    <div className="app-root">
      <Carousel />

      <div className="audio-holder" aria-hidden="true" style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden', left: '-9999px'}}>
        <audio ref={audioRef} loop preload="auto">
          <source src="/assets/audio/lover1.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {!cardsVisible && (
        <div>
          <button className="show-cards-btn" onClick={handleShowCards} aria-label="Show cards">
            Show Cards
          </button>
        </div>
      )}

      {cardsVisible && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-center">
            <Card
              data={fullCards[currentCardIndex]}
              onNext={handleNext}
              onClose={handleCloseCard}
            />
          </div>
        </div>
      )}

      

      {finalPopupVisible && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-center">
            <div className="popup-card visible" role="dialog" aria-modal="true" ref={popupRef}>
              <button className="close-btn" onClick={() => setFinalPopupVisible(false)} aria-label="Close">✕</button>
              <h3>So, Ms. Rhea Ramaprasad, Will you please be my Valentine?</h3>
              <p style={{ color: '#fff' }}>If your answer is yes, press the heart below 🥳</p>
              <div className="controls" style={{ justifyContent: 'center', marginTop: 18, minHeight: 56 }}>
                <button className="next-text" onClick={() => { handleFinalYes(); }}>Yes ❤️</button>
                <button
                  ref={maybeRef}
                  className="next-text"
                  onMouseEnter={moveMaybe}
                  onFocus={moveMaybe}
                  onClick={(e) => { e.preventDefault(); moveMaybe(); }}
                  style={{
                    position: 'absolute',
                    transition: 'left 160ms ease, top 160ms ease, transform 120ms ease',
                    left: maybePos ? `${maybePos.left}px` : '50%',
                    top: maybePos ? `${maybePos.top}px` : 'calc(100% - 56px)',
                    transform: maybePos ? 'none' : 'translateX(-50%)'
                  }}
                >
                  Maybe later 🙄
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const rootEl = document.getElementById('root');
if (!rootEl) document.body.innerHTML = '<div style="color:red;padding:20px">Missing #root in public/index.html</div>';
else {
  const root = createRoot(rootEl);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}