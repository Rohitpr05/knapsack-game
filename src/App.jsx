import React, { useState, useEffect } from 'react';
import PackageCard from './components/PackageCard';
import Truck from './components/Truck';
import GameResult from './components/GameResult';
import Map from './components/map';
import LevelComplete from './components/LevelComplete';
import { knapsack } from './utils/knapsack';

const App = () => {
  const [packages, setPackages] = useState([]);
  const [capacity, setCapacity] = useState(15);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showOptimal, setShowOptimal] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'completed', 'moving'
  const [isMoving, setIsMoving] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);

  // Location names for each level
  const locations = [
    "Downtown Depot", "Suburb Mall", "Industrial Zone", "Harbor Port", 
    "Mountain Village", "Airport Terminal", "Beach Resort", "Forest Camp", 
    "City Center", "Space Station"
  ];

  // Generate random packages based on level
  const generatePackages = (level) => {
    const numPackages = Math.min(6 + level, 12);
    const newPackages = [];
    
    for (let i = 1; i <= numPackages; i++) {
      const weight = Math.floor(Math.random() * 8) + 1;
      const baseProfit = weight * 2 + Math.floor(Math.random() * 30);
      const profit = Math.floor(baseProfit * (1 + level * 0.1));
      newPackages.push({ id: i, weight, profit });
    }
    
    return newPackages;
  };

  // Initialize game when level/gameState changes
  useEffect(() => {
    if (gameState === 'playing') {
      setPackages(generatePackages(level));
      setSelectedPackages([]);
      setShowOptimal(false);
    }
  }, [level, gameState]);

  // Toggle package selection
  const togglePackage = (pkg) => {
    if (gameState !== 'playing') return;
    
    setSelectedPackages(prev => {
      const isSelected = prev.some(p => p.id === pkg.id);
      if (isSelected) {
        return prev.filter(p => p.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
    setShowOptimal(false);
  };

  // Calculate user's current profit and weight
  const userWeight = selectedPackages.reduce((sum, p) => sum + p.weight, 0);
  const userProfit = userWeight <= capacity
    ? selectedPackages.reduce((sum, p) => sum + p.profit, 0)
    : 0;

  // Get optimal solution safely
  const { maxProfit = 0, chosen = [] } = knapsack(packages, capacity) || {};

  // Complete level
  const completeLevel = () => {
    if (userWeight > capacity) {
      alert('🚨 Your truck is overweight! Remove some packages first.');
      return;
    }
    if (selectedPackages.length === 0) {
      alert('📦 Select some packages to deliver first!');
      return;
    }

    const coinsEarned = Math.floor(userProfit / 10);
    setTotalCoins(prev => prev + coinsEarned);
    
    setCompletedLevels(prev => [
      ...prev,
      {
        level,
        profit: userProfit,
        maxProfit,
        efficiency: maxProfit > 0 ? ((userProfit / maxProfit) * 100) : 0
      }
    ]);
    
    setGameState('completed');
  };

  // Continue to next level
  const continueToNextLevel = () => {
    if (isMoving) return;
    setGameState('moving');
    setIsMoving(true);
  };

  // Truck reached new location
  const handleLocationReached = () => {
    if (!isMoving) return;
    setIsMoving(false);
    setLevel(prev => prev + 1);
    setCapacity(prev => prev + 2);
    setGameState('playing');
  };

  // Replay current level
  const replayLevel = () => {
    setGameState('playing');
    setSelectedPackages([]);
    setShowOptimal(false);
    setPackages(generatePackages(level));
  };

  // Reset entire game
  const resetGame = () => {
    setLevel(1);
    setCapacity(15);
    setSelectedPackages([]);
    setShowOptimal(false);
    setGameState('playing');
    setTotalCoins(0);
    setCompletedLevels([]);
    setIsMoving(false);
  };

  const currentLocation = locations[(level - 1) % locations.length];
  const nextLocation = locations[level % locations.length];

  return (
    <div style={{ 
      fontFamily: "'Press Start 2P', monospace",
      background: 'linear-gradient(135deg, #87ceeb 0%, #98fb98 50%, #f0e68c 100%)',
      minHeight: '100vh',
      padding: '20px',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          margin: '20px 0',
          textShadow: '3px 3px 0px #000',
          color: '#fff'
        }}>
          🚚 DELIVERY ADVENTURE 📦
        </h1>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={statBoxStyle}>🏆 Level: {level}</div>
          <div style={statBoxStyle}>🪙 Coins: {totalCoins}</div>
          <div style={statBoxStyle}>📍 {currentLocation}</div>
        </div>
      </div>

      {/* Map */}
      <Map 
        currentLevel={level}
        isMoving={isMoving}
        onLocationReached={handleLocationReached}
      />

      {/* Game Controls */}
      {gameState === 'playing' && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={completeLevel}
            disabled={userWeight > capacity || selectedPackages.length === 0}
            style={{
              ...buttonStyle,
              background: (userWeight > capacity || selectedPackages.length === 0) ? '#999' : '#32cd32',
              cursor: (userWeight > capacity || selectedPackages.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            🏁 COMPLETE DELIVERY
          </button>
          
          <button 
            onClick={() => setShowOptimal(!showOptimal)}
            style={{ ...buttonStyle, background: '#ff6b6b' }}
          >
            {showOptimal ? '🙈 HIDE SOLUTION' : '💡 SHOW OPTIMAL'}
          </button>

          <button 
            onClick={() => { setSelectedPackages([]); setShowOptimal(false); }}
            style={{ ...buttonStyle, background: '#95a5a6' }}
          >
            🔄 RESET
          </button>

          <button 
            onClick={resetGame}
            style={{ ...buttonStyle, background: '#e74c3c' }}
          >
            🏠 NEW GAME
          </button>
        </div>
      )}

      {/* Packages */}
      {gameState === 'playing' && (
        <div style={packageGridStyle}>
          {packages.map(pkg => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              isSelected={selectedPackages.some(p => p.id === pkg.id)}
              onToggle={togglePackage}
            />
          ))}
        </div>
      )}

      {/* Game Status */}
      {gameState === 'playing' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Truck chosen={selectedPackages} capacity={capacity} />
          {showOptimal && (
            <GameResult 
              maxProfit={maxProfit} 
              chosen={chosen}
              userProfit={userProfit}
              userWeight={userWeight}
            />
          )}
        </div>
      )}

      {/* Moving State */}
      {gameState === 'moving' && (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '16px', color: '#333' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚚💨</div>
          <p>Traveling to {nextLocation}...</p>
          <div style={{ width: '200px', height: '20px', background: '#ddd', margin: '20px auto', borderRadius: '10px', overflow: 'hidden', border: '2px solid #333' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #32cd32, #228b22)', width: '100%', animation: 'loadingBar 2s ease-in-out' }}></div>
          </div>
        </div>
      )}

      {/* Level Complete */}
      {gameState === 'completed' && (
        <LevelComplete
          level={level}
          userProfit={userProfit}
          maxProfit={maxProfit}
          nextLocationName={nextLocation}
          onContinue={continueToNextLevel}
          onReplay={replayLevel}
        />
      )}

      {/* Instructions */}
      {gameState === 'playing' && (
        <div style={instructionsBoxStyle}>
          <p style={instructionsTextStyle}>🎯 <strong>Goal:</strong> Maximize profit by picking packages!</p>
          <p style={instructionsTextStyle}>⚠️ Don’t exceed capacity or you get $0!</p>
          <p style={instructionsTextStyle}>🗺️ Complete deliveries to unlock new locations!</p>
          <p style={instructionsTextStyle}>💰 Earn coins based on performance!</p>
        </div>
      )}

      {/* Delivery History */}
      {completedLevels.length > 0 && gameState === 'playing' && (
        <div style={historyBoxStyle}>
          <h3 style={{ fontSize: '12px', marginBottom: '15px', textAlign: 'center' }}>📊 DELIVERY HISTORY</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {completedLevels.slice(-5).map((completedLevel, index) => (
              <div key={index} style={{
                background: completedLevel.efficiency >= 80 ? 'rgba(50, 205, 50, 0.2)' : completedLevel.efficiency >= 50 ? 'rgba(255, 140, 0, 0.2)' : 'rgba(255, 99, 99, 0.2)',
                padding: '8px',
                borderRadius: '5px',
                border: '2px solid #333',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                <div>🏆 Level {completedLevel.level}</div>
                <div>💰 ${completedLevel.profit}/{completedLevel.maxProfit}</div>
                <div>⚡ {completedLevel.efficiency.toFixed(1)}%</div>
                <div>
                  {completedLevel.efficiency >= 100 ? '🌟🌟🌟' : completedLevel.efficiency >= 80 ? '🌟🌟' : completedLevel.efficiency >= 50 ? '🌟' : '⭐'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// Reusable style objects
const statBoxStyle = {
  background: 'rgba(255,255,255,0.9)',
  padding: '8px 15px',
  borderRadius: '20px',
  border: '3px solid #333',
  fontSize: '10px'
};

const buttonStyle = {
  fontFamily: "'Press Start 2P', monospace",
  border: '4px solid #333',
  padding: '12px 20px',
  color: 'white',
  fontSize: '10px',
  margin: '0 10px'
};

const packageGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '30px'
};

const instructionsBoxStyle = {
  textAlign: 'center',
  marginTop: '30px',
  background: 'rgba(255,255,255,0.8)',
  padding: '15px',
  borderRadius: '10px',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const instructionsTextStyle = {
  fontSize: '10px',
  margin: '5px 0'
};

const historyBoxStyle = {
  marginTop: '30px',
  background: 'rgba(255,255,255,0.9)',
  padding: '15px',
  borderRadius: '10px',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '3px solid #333'
};

export default App;
