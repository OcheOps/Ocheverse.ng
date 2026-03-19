import { useEffect, useState, useCallback, useRef } from 'react';

// Shortened Konami: ↑↑↓↓←→ (6 keys instead of 10)
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export default function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const triggerEasterEgg = useCallback(() => {
    // Emoji rain
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden';
    document.body.appendChild(container);

    const emojis = ['🚀', '⚡', '🔥', '💯', '🎮', '👾', '🏆', '🎉', '✨', '💎', '🐐', '🇳🇬'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position:absolute;top:-50px;left:${Math.random() * 100}%;
        font-size:${20 + Math.random() * 25}px;
        animation:eggFall ${2 + Math.random() * 3}s linear forwards;
        animation-delay:${Math.random() * 1.5}s;opacity:0;
      `;
      container.appendChild(el);
    }

    // Achievement popup
    const popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;pointer-events:none;padding:16px';
    popup.innerHTML = `
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;padding:24px 32px;
        border-radius:20px;text-align:center;border:2px solid #10b981;max-width:320px;width:100%;
        box-shadow:0 0 60px rgba(16,185,129,0.3);animation:eggPop 0.5s ease-out;pointer-events:auto">
        <div style="font-size:40px;margin-bottom:8px">🏆</div>
        <div style="font-size:20px;font-weight:bold;margin-bottom:4px">Achievement Unlocked!</div>
        <div style="color:#10b981;font-size:13px">Secret Code Master</div>
        <div style="color:#6b7280;font-size:11px;margin-top:8px">You found a secret. There might be more...</div>
      </div>
    `;
    document.body.appendChild(popup);

    // Vibrate on mobile if supported
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    setTimeout(() => {
      container.remove();
      popup.remove();
      setKonamiIndex(0);
      tapCount.current = 0;
    }, 4000);
  }, []);

  // Keyboard: Konami code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === KONAMI[konamiIndex]) {
        const next = konamiIndex + 1;
        if (next === KONAMI.length) {
          triggerEasterEgg();
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(e.key === KONAMI[0] ? 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, triggerEasterEgg]);

  // Mobile: Triple tap the logo area triggers it
  useEffect(() => {
    const handleLogoTap = () => {
      tapCount.current++;
      if (tapTimer.current) clearTimeout(tapTimer.current);

      if (tapCount.current >= 5) {
        tapCount.current = 0;
        triggerEasterEgg();
        return;
      }

      if (tapCount.current >= 3) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 2000);
      }

      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 1500);
    };

    // Attach to elements with data-easter-egg attribute
    const targets = document.querySelectorAll('[data-easter-egg]');
    targets.forEach((el) => el.addEventListener('click', handleLogoTap));
    return () => targets.forEach((el) => el.removeEventListener('click', handleLogoTap));
  }, [triggerEasterEgg]);

  // Console easter egg
  useEffect(() => {
    console.log(
      '%c🔥 Ocheverse %c\n\nYou found the console. Respect.\nTry tapping the logo 5 times. Or the Konami Code.\n\n— David Gideon',
      'font-size:24px;font-weight:bold;color:#10b981;',
      'font-size:13px;color:#9ca3af;'
    );
  }, []);

  return (
    <>
      {showHint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-green-400 text-xs px-4 py-2 rounded-full shadow-lg animate-bounce">
          Keep going... 👀
        </div>
      )}
      <style jsx global>{`
        @keyframes eggFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes eggPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
