import React, { useState, useEffect, useRef } from 'react';

const Map = ({ currentLevel, isMoving, gameState, onLocationReached }) => {
  const [truckPosition, setTruckPosition] = useState({ x: 10, y: 80 });
  const [animating, setAnimating] = useState(false);
  const animationRef = useRef(null);
  const hasCalledCallbackRef = useRef(false);

  // Define map locations for each level
  const locations = [
    { id: 1, name: "Downtown Depot", x: 10, y: 80, emoji: "🏢", color: "#4169e1" },
    { id: 2, name: "Suburb Mall", x: 30, y: 60, emoji: "🏬", color: "#32cd32" },
    { id: 3, name: "Industrial Zone", x: 60, y: 40, emoji: "🏭", color: "#ff8c00" },
    { id: 4, name: "Harbor Port", x: 80, y: 70, emoji: "🚢", color: "#1e90ff" },
    { id: 5, name: "Mountain Village", x: 40, y: 20, emoji: "🏔️", color: "#8b4513" },
    { id: 6, name: "Airport Terminal", x: 70, y: 15, emoji: "✈️", color: "#ff69b4" },
    { id: 7, name: "Beach Resort", x: 90, y: 85, emoji: "🏖️", color: "#ffd700" },
    { id: 8, name: "Forest Camp", x: 20, y: 30, emoji: "🏕️", color: "#228b22" },
    { id: 9, name: "City Center", x: 50, y: 50, emoji: "🏙️", color: "#9370db" },
    { id: 10, name: "Space Station", x: 85, y: 25, emoji: "🚀", color: "#ff1493" }
  ];

  const currentLocation = locations[(currentLevel - 1) % locations.length];
  const nextLocation = locations[currentLevel % locations.length];

  // Reset callback flag when starting new movement
  useEffect(() => {
    if (isMoving && gameState === 'moving') {
      hasCalledCallbackRef.current = false;
    }
  }, [isMoving, gameState]);

  // Animate truck movement when moving to next level
  useEffect(() => {
    // Only animate if we're in moving state and have a next location
    if (isMoving && gameState === 'moving' && nextLocation) {
      setAnimating(true);

      const startX = truckPosition.x;
      const startY = truckPosition.y;
      const targetX = nextLocation.x;
      const targetY = nextLocation.y;

      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setTruckPosition({
          x: startX + (targetX - startX) * easeProgress,
          y: startY + (targetY - startY) * easeProgress,
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation completed
          setAnimating(false);
          
          // Call the callback only once
          if (!hasCalledCallbackRef.current && onLocationReached) {
            hasCalledCallbackRef.current = true;
            onLocationReached();
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      // Cleanup function
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isMoving, gameState, nextLocation, onLocationReached, truckPosition.x, truckPosition.y]);

  // Generate road paths between locations
  const generateRoads = () => {
    const roads = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const start = locations[i];
      const end = locations[i + 1];
      roads.push(
        <line
          key={`road-${i}`}
          x1={`${start.x}%`}
          y1={`${start.y}%`}
          x2={`${end.x}%`}
          y2={`${end.y}%`}
          stroke="#654321"
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.6"
        />
      );
    }
    return roads;
  };

  return (
    <div style={{
      width: '100%',
      height: '300px',
      background: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 60%, #f4a460 100%)',
      border: '4px solid #333',
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '4px 4px #000',
      margin: '20px 0'
    }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '30px', opacity: '0.3' }}>☁️</div>
      <div style={{ position: 'absolute', top: '15%', right: '15%', fontSize: '40px', opacity: '0.4' }}>🌞</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '60%', fontSize: '25px', opacity: '0.3' }}>🌳</div>

      {/* SVG for roads */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {generateRoads()}
      </svg>

      {/* Location markers */}
      {locations.slice(0, Math.min(currentLevel + 2, locations.length)).map((location) => {
        const isCurrentLocation = location.id === currentLocation.id;
        const isNextLocation = nextLocation && location.id === nextLocation.id;
        const isCompleted = location.id < currentLevel;

        return (
          <div
            key={location.id}
            style={{
              position: 'absolute',
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: isCurrentLocation ? 10 : 5
            }}
          >
            <div style={{
              fontSize: isCurrentLocation ? '35px' : '25px',
              marginBottom: '5px',
              filter: isCompleted ? 'grayscale(50%)' : 'none',
              transform: isCurrentLocation ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s ease',
              animation: (isNextLocation && gameState === 'moving') ? 'pulse 1s infinite' : 'none'
            }}>
              {location.emoji}
            </div>

            <div style={{
              background: isCurrentLocation ? location.color : 'rgba(255,255,255,0.9)',
              color: isCurrentLocation ? 'white' : '#333',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
              border: '1px solid #333',
              whiteSpace: 'nowrap',
              opacity: isCompleted ? 0.7 : 1
            }}>
              {location.name}
            </div>

            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: isCompleted ? '#32cd32' : isCurrentLocation ? '#ffd700' : '#ccc',
              color: '#333',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
              border: '2px solid #333'
            }}>
              {isCompleted ? '✓' : location.id}
            </div>
          </div>
        );
      })}

      {/* Animated Truck */}
      <div
        style={{
          position: 'absolute',
          left: `${truckPosition.x}%`,
          top: `${truckPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          fontSize: '30px',
          zIndex: 20,
          transition: animating ? 'none' : 'all 0.5s ease',
          animation: animating ? 'truckBounce 0.5s ease-in-out infinite' : 'none',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
        }}
      >
        🚚
      </div>

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '5px',
        fontSize: '10px',
        fontFamily: "'Press Start 2P', monospace"
      }}>
        📍 Level {currentLevel}: {currentLocation.name}
        {gameState === 'moving' && (
          <div style={{ marginTop: '5px', color: '#ffd700' }}>
            🚚 Moving to {nextLocation?.name}...
          </div>
        )}
      </div>

      {/* Movement indicator */}
      {gameState === 'moving' && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 215, 0, 0.9)',
          color: '#333',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '10px',
          fontFamily: "'Press Start 2P', monospace",
          border: '2px solid #333',
          animation: 'slideUp 0.5s ease-out'
        }}>
          🚛💨 En route to next delivery zone!
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes truckBounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-3px); }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0px); 
          }
        }
      `}</style>
    </div>
  );
};

export default Map;