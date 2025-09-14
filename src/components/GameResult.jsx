import React from 'react';

const GameResult = ({ maxProfit, chosen, userProfit, userWeight }) => {
  const isPerfect = userProfit === maxProfit;
  const efficiency = maxProfit > 0 ? ((userProfit / maxProfit) * 100).toFixed(1) : 0;

  return (
    <div 
      className="pixel-card" 
      style={{ 
        background: "#444", 
        color: "white", 
        minWidth: '250px',
        padding: '16px',
        border: '4px solid #333',
        boxShadow: '4px 4px #000'
      }}
    >
      <h3 style={{ margin: '10px 0', fontSize: '14px', textAlign: 'center' }}>
        🏆 Results Analysis
      </h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '15px',
        borderBottom: '2px solid #666',
        paddingBottom: '10px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#87ceeb' }}>
            <strong>YOUR SOLUTION:</strong>
          </p>
          <p style={{ fontSize: '9px', margin: '2px 0' }}>💰 Profit: ${userProfit}</p>
          <p style={{ fontSize: '9px', margin: '2px 0' }}>⚖️ Weight: {userWeight}kg</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', margin: '2px 0', color: '#98fb98' }}>
            <strong>OPTIMAL:</strong>
          </p>
          <p style={{ fontSize: '9px', margin: '2px 0' }}>💰 Profit: ${maxProfit}</p>
          <p style={{ fontSize: '9px', margin: '2px 0' }}>
            📦 Packages: {chosen.map(p => p.id).join(", ")}
          </p>
        </div>
      </div>

      {/* Efficiency Score */}
      <div style={{ 
        textAlign: 'center', 
        background: isPerfect ? '#2e8b57' : efficiency >= 80 ? '#ff8c00' : '#dc143c',
        padding: '10px',
        border: '2px solid #000',
        margin: '10px 0'
      }}>
        <p style={{ fontSize: '10px', margin: '2px 0' }}>
          📊 EFFICIENCY: {efficiency}%
        </p>
        <p style={{ fontSize: '8px', margin: '2px 0' }}>
          {isPerfect ? '🎉 PERFECT SOLUTION!' : 
           efficiency >= 80 ? '👍 Great job!' : 
           efficiency >= 50 ? '👌 Not bad!' : 
           '💪 Keep trying!'}
        </p>
      </div>

      {/* Optimal Solution Details */}
      <div style={{ marginTop: '15px' }}>
        <p style={{ fontSize: '10px', margin: '5px 0', color: '#ffd700' }}>
          <strong>💡 Optimal Strategy:</strong>
        </p>
        <div style={{ maxHeight: '80px', overflowY: 'auto', fontSize: '8px' }}>
          {chosen.map((pkg, i) => (
            <p key={i} style={{ margin: '1px 0', opacity: 0.9 }}>
              📦 #{pkg.id}: {pkg.weight}kg → ${pkg.profit} 
              <span style={{ color: '#90ee90' }}>
                (${(pkg.profit/pkg.weight).toFixed(1)}/kg)
              </span>
            </p>
          ))}
        </div>
      </div>

      {!isPerfect && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          background: '#4169e1',
          border: '2px solid #fff',
          fontSize: '8px',
          textAlign: 'center'
        }}>
          💭 Tip: Look for packages with high profit-to-weight ratio!
        </div>
      )}
    </div>
  );
};

export default GameResult;