import React from 'react';

const Truck = ({ chosen, capacity }) => {
  const totalWeight = chosen.reduce((sum, p) => sum + p.weight, 0);
  const totalProfit = chosen.reduce((sum, p) => sum + p.profit, 0);
  const isOverCapacity = totalWeight > capacity;
  const capacityPercentage = Math.min((totalWeight / capacity) * 100, 100);

  return (
    <div 
      className="pixel-card" 
      style={{ 
        background: isOverCapacity ? '#dc143c' : '#2e8b57', 
        color: "white",
        minWidth: '220px',
        padding: '16px',
        border: '4px solid #333',
        boxShadow: '4px 4px #000'
      }}
    >
      <h3 style={{ margin: '10px 0', fontSize: '14px' }}>🚚 Truck Status</h3>
      
      {/* Capacity Bar */}
      <div style={{ 
        background: '#333', 
        height: '20px', 
        border: '2px solid #000',
        margin: '10px 0',
        position: 'relative'
      }}>
        <div style={{
          background: isOverCapacity ? '#ff4444' : '#44ff44',
          height: '100%',
          width: `${capacityPercentage}%`,
          transition: 'all 0.3s ease'
        }}></div>
        <p style={{ 
          position: 'absolute', 
          top: '1px', 
          left: '5px', 
          fontSize: '8px',
          color: '#000',
          fontWeight: 'bold'
        }}>
          {totalWeight}/{capacity}kg
        </p>
      </div>

      <div style={{ fontSize: '10px', textAlign: 'left' }}>
        <p style={{ margin: '5px 0' }}>
          📊 Capacity: {capacity}kg
        </p>
        <p style={{ margin: '5px 0' }}>
          ⚖️ Used: {totalWeight}kg {isOverCapacity && '⚠️ OVERWEIGHT!'}
        </p>
        <p style={{ margin: '5px 0' }}>
          💰 Profit: ${isOverCapacity ? 0 : totalProfit}
        </p>
      </div>

      <div style={{ marginTop: '15px', borderTop: '2px solid #fff', paddingTop: '10px' }}>
        <p style={{ fontSize: '10px', fontWeight: 'bold' }}>📦 Loaded Packages:</p>
        {chosen.length === 0 ? (
          <p style={{ fontSize: '10px', fontStyle: 'italic', opacity: 0.8 }}>
            Empty truck - Click packages to load!
          </p>
        ) : (
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {chosen.map((pkg, i) => (
              <p key={i} style={{ fontSize: '9px', margin: '2px 0' }}>
                📦 #{pkg.id} - {pkg.weight}kg - ${pkg.profit}
              </p>
            ))}
          </div>
        )}
      </div>
      
      {isOverCapacity && (
        <div style={{ 
          marginTop: '10px', 
          padding: '5px', 
          background: '#ff6b6b',
          border: '2px solid #fff',
          fontSize: '8px'
        }}>
          ⚠️ Remove packages to earn money!
        </div>
      )}
    </div>
  );
};

export default Truck;