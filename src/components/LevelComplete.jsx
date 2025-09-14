import React, { useState, useEffect } from 'react';

const LevelComplete = ({ 
  level, 
  userProfit, 
  maxProfit, 
  nextLocationName,
  onContinue,
  onReplay 
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [coins, setCoins] = useState([]);

  const isPerfect = userProfit === maxProfit;
  const efficiency = maxProfit > 0 ? ((userProfit / maxProfit) * 100).toFixed(1) : 0;
  
  // Star rating based on efficiency
  const getStars = () => {
    if (efficiency >= 100) return 3;
    if (efficiency >= 80) return 2;
    if (efficiency >= 50) return 1;
    return 0;
  };

  const stars = getStars();

  // Generate reward coins animation
  useEffect(() => {
    if (isPerfect) {
      setShowFireworks(true);
      
      // Generate flying coins
      const newCoins = [];
      for (let i = 0; i < 8; i++) {
        newCoins.push({
          id: i,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 40,
          delay: i * 0.2
        });
      }
      setCoins(newCoins);

      setTimeout(() => {
        setShowFireworks(false);
        setCoins([]);
      }, 3000);
    }
  }, [isPerfect]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Fireworks background */}
      {showFireworks && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
                fontSize: '30px',
                animation: `firework 1.5s ease-out ${i * 0.3}s`,
                animationFillMode: 'both'
              }}
            >
              🎆
            </div>
          ))}
        </div>
      )}

      {/* Flying coins */}
      {coins.map(coin => (
        <div
          key={coin.id}
          style={{
            position: 'absolute',
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            fontSize: '25px',
            animation: `coinFly 2s ease-out ${coin.delay}s`,
            animationFillMode: 'both',
            pointerEvents: 'none'
          }}
        >
          💰
        </div>
      ))}

      {/* Main completion card */}
      <div style={{
        background: 'linear-gradient(135deg, #ffd700, #ffed4e, #ffd700)',
        border: '6px solid #333',
        borderRadius: '15px',
        padding: '30px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        fontFamily: "'Press Start 2P', monospace",
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideIn 0.5s ease-out'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          fontSize: '40px',
          opacity: '0.3',
          animation: 'rotate 3s linear infinite'
        }}>⚙️</div>
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          fontSize: '35px',
          opacity: '0.3',
          animation: 'rotate 4s linear infinite reverse'
        }}>🎯</div>

        {/* Header */}
        <div style={{
          fontSize: '20px',
          color: '#333',
          marginBottom: '20px',
          textShadow: '2px 2px 0px rgba(255,255,255,0.8)'
        }}>
          🏆 LEVEL {level} COMPLETE! 🏆
        </div>

        {/* Stars */}
        <div style={{
          fontSize: '30px',
          marginBottom: '15px',
          letterSpacing: '5px'
        }}>
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              style={{
                color: i < stars ? '#ffd700' : '#ccc',
                filter: i < stars ? 'drop-shadow(0 0 10px #ffd700)' : 'none',
                animation: i < stars ? `starTwinkle 1s ease-in-out ${i * 0.2}s` : 'none',
                display: 'inline-block'
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Performance stats */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '15px',
          borderRadius: '10px',
          border: '3px solid #333',
          marginBottom: '20px',
          color: '#333'
        }}>
          <div style={{ fontSize: '12px', marginBottom: '10px' }}>
            📊 PERFORMANCE REPORT
          </div>
          
          <div style={{ fontSize: '10px', marginBottom: '5px' }}>
            💰 Your Profit: ${userProfit}
          </div>
          <div style={{ fontSize: '10px', marginBottom: '5px' }}>
            🎯 Max Possible: ${maxProfit}
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: efficiency >= 80 ? '#32cd32' : efficiency >= 50 ? '#ff8c00' : '#ff4444',
            fontWeight: 'bold'
          }}>
            ⚡ Efficiency: {efficiency}%
          </div>
        </div>

        {/* Achievement message */}
        <div style={{
          fontSize: '10px',
          color: '#333',
          marginBottom: '15px',
          padding: '10px',
          background: isPerfect ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 140, 0, 0.2)',
          borderRadius: '8px',
          border: `2px solid ${isPerfect ? '#32cd32' : '#ff8c00'}`
        }}>
          {isPerfect ? (
            <>🎉 PERFECT DELIVERY! 🎉<br/>You found the optimal solution!</>
          ) : efficiency >= 80 ? (
            <>👏 EXCELLENT WORK! 👏<br/>Nearly perfect optimization!</>
          ) : efficiency >= 50 ? (
            <>👍 GOOD JOB! 👍<br/>Room for improvement, but solid!</>
          ) : (
            <>💪 KEEP TRYING! 💪<br/>Practice makes perfect!</>
          )}
        </div>

        {/* Next destination */}
        <div style={{
          fontSize: '10px',
          color: '#333',
          marginBottom: '20px',
          padding: '8px',
          background: 'rgba(135, 206, 235, 0.3)',
          borderRadius: '8px',
          border: '2px dashed #4169e1'
        }}>
          🗺️ Next Stop: {nextLocationName}
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onContinue}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #32cd32, #228b22)',
              color: 'white',
              border: '4px solid #333',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
              boxShadow: '4px 4px 0px #000'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '6px 6px 0px #000';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '4px 4px 0px #000';
            }}
          >
            🚚 CONTINUE JOURNEY
          </button>

          <button
            onClick={onReplay}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #ff8c00, #ff6b00)',
              color: 'white',
              border: '4px solid #333',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
              boxShadow: '4px 4px 0px #000'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '6px 6px 0px #000';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '4px 4px 0px #000';
            }}
          >
            🔄 REPLAY LEVEL
          </button>
        </div>

        {/* Bonus coins earned */}
        <div style={{
          marginTop: '15px',
          fontSize: '8px',
          color: '#666'
        }}>
          Coins Earned: {Math.floor(userProfit / 10)} 🪙
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
          to { 
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
        
        @keyframes firework {
          0% { 
            opacity: 1; 
            transform: scale(0.5);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5) rotate(180deg);
          }
          100% { 
            opacity: 0; 
            transform: scale(2) rotate(360deg);
          }
        }
        
        @keyframes coinFly {
          0% { 
            opacity: 1; 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: translateY(-30px) rotate(180deg); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-60px) rotate(360deg) scale(1.5); 
          }
        }
        
        @keyframes starTwinkle {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            filter: drop-shadow(0 0 5px #ffd700);
          }
          50% { 
            transform: scale(1.2) rotate(10deg); 
            filter: drop-shadow(0 0 15px #ffd700);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LevelComplete;