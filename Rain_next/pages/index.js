import { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';

export default function Home() {
  const rainContainerRef = useRef(null);
  const emojiPositionsRef = useRef(new Set()); // Use ref for positions to avoid re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const mouseRadius = 100; // Radius around mouse where emojis will avoid

  const fireEmoji = '🔥';
  const fallSpeed = 8;

  // Function to check if the new emoji will overlap with existing ones
  const isOverlap = (newX) => {
    return Array.from(emojiPositionsRef.current).some(existingX => Math.abs(newX - existingX) < 40);
  };

  // Function to check if emoji is too close to mouse
  const isNearMouse = (x, y) => {
    const distance = Math.sqrt(
      Math.pow(x - mousePositionRef.current.x, 2) + Math.pow(y - mousePositionRef.current.y, 2)
    );
    return distance < mouseRadius;
  };

  // Function to update emoji positions based on mouse proximity
  const updateEmojiPositions = useCallback(() => {
    if (!rainContainerRef.current) return;

    const emojis = rainContainerRef.current.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
      const rect = emoji.getBoundingClientRect();
      const emojiX = rect.left + rect.width / 2;
      const emojiY = rect.top + rect.height / 2;

      // Check if emoji is near mouse
      if (isNearMouse(emojiX, emojiY)) {
        const angle = Math.atan2(emojiY - mousePositionRef.current.y, emojiX - mousePositionRef.current.x);
        const pushDistance = mouseRadius + 20; // Push outside the mouse radius
        
        // Calculate new position that avoids the mouse
        const newX = mousePositionRef.current.x + Math.cos(angle) * pushDistance;
        const newY = mousePositionRef.current.y + Math.sin(angle) * pushDistance;
        
        // Apply the avoidance movement smoothly
        emoji.style.transform = `translate(${newX - emojiX}px, ${newY - emojiY}px)`;
      } else {
        // Reset transform if not near mouse
        emoji.style.transform = 'none';
      }
    });

    animationFrameRef.current = requestAnimationFrame(updateEmojiPositions);
  }, []);

  // Function to create and animate the falling emoji
  const createFallingEmoji = useCallback(() => {
    if (!rainContainerRef.current) return;

    const emoji = document.createElement('span');
    emoji.textContent = fireEmoji;
    emoji.classList.add('emoji');

    // Randomize the starting horizontal position
    let startX = Math.random() * window.innerWidth;
    let startY = -30;

    // Ensure the new emoji doesn't overlap with existing ones
    let attempts = 0;
    while (isOverlap(startX) && attempts < 20) {
      startX = Math.random() * window.innerWidth;
      attempts++;
    }

    // Set emoji's starting position
    emoji.style.left = `${startX}px`;
    emoji.style.top = `${startY}px`;

    // Add slight horizontal drift for more natural movement
    const driftAmount = (Math.random() - 0.5) * 20;
    emoji.style.setProperty('--drift', `${driftAmount}px`);

    // Set animation duration
    const animationDuration = `${fallSpeed + Math.random() * 2}s`;
    emoji.style.animationDuration = animationDuration;

    // Add the emoji to the rain container
    rainContainerRef.current.appendChild(emoji);

    // Track this emoji's position
    emojiPositionsRef.current.add(startX);

    // Remove the emoji after it finishes falling
    emoji.addEventListener('animationend', () => {
      if (emoji.parentNode) {
        emoji.remove();
      }
      emojiPositionsRef.current.delete(startX);
    });
  }, []);

  // Track mouse movement
  const handleMouseMove = useCallback((e) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Function to continuously create fire emojis
  const startRain = useCallback(() => {
    return setInterval(() => {
      const numEmojis = Math.floor(Math.random() * 8) + 3;
      for (let i = 0; i < numEmojis; i++) {
        createFallingEmoji();
      }
    }, 150);
  }, [createFallingEmoji]);

  useEffect(() => {
    const interval = startRain();
    
    // Start the position update loop
    animationFrameRef.current = requestAnimationFrame(updateEmojiPositions);
    
    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rainContainerRef.current) {
        rainContainerRef.current.innerHTML = '';
      }
      emojiPositionsRef.current.clear();
    };
  }, [startRain, updateEmojiPositions, handleMouseMove]);

  return (
    <>
      <Head>
        <title>Fire Emoji Rain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      {/* Container for the falling fire emojis */}
      <div ref={rainContainerRef} className="rain"></div>
      
      {/* Visual indicator for mouse avoidance area */}
      <div className="mouse-area"></div>

      <style jsx global>{`
        /* Basic reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Full page styling */
        body {
          width: 100%;
          height: 100vh;
          background-color: #000;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: default;
        }

        /* Container for the falling emojis */
        .rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Style for the fire emoji */
        .emoji {
          position: absolute;
          font-size: 28px;
          color: #FF4500;
          animation: fall linear forwards;
          will-change: transform;
          user-select: none;
          z-index: 1;
          transition: transform 0.3s ease-out; /* Smooth movement around mouse */
        }

        /* Mouse avoidance area indicator */
        .mouse-area {
          position: absolute;
          width: ${mouseRadius * 2}px;
          height: ${mouseRadius * 2}px;
          border: 1px dashed rgba(255, 69, 0, 0.3);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          left: ${mousePositionRef.current.x}px;
          top: ${mousePositionRef.current.y}px;
          opacity: 0.3;
          z-index: 2;
        }

        /* Fall animation */
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift, 0));
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(calc(var(--drift, 0) * 2));
            opacity: 0;
          }
        }

        /* Reduced motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .emoji {
            animation-duration: 20s !important;
          }
        }
      `}</style>
    </>
  );
}