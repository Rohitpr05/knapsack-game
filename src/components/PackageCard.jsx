import React from 'react';

const PackageCard = ({ pkg, isSelected, onToggle }) => {
  return (
    <div 
      className={`pixel-card package-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(pkg)}
      style={{ 
        background: isSelected ? '#32cd32' : '#deb887',
        cursor: 'pointer',
        border: isSelected ? '4px solid #228b22' : '4px solid #333',
        padding: '16px',
        margin: '12px',
        display: 'inline-block',
        minWidth: '120px',
        boxShadow: '4px 4px #000',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>📦 Package {pkg.id}</p>
      <p style={{ margin: '5px 0', fontSize: '10px' }}>Weight: {pkg.weight}kg</p>
      <p style={{ margin: '5px 0', fontSize: '10px' }}>Profit: ${pkg.profit}</p>
      {isSelected && (
        <p style={{ margin: '5px 0', fontSize: '8px', color: '#006400' }}>✓ SELECTED</p>
      )}
    </div>
  );
};

export default PackageCard;