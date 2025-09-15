export function knapsack(packages, capacity) {
  if (!packages || packages.length === 0 || capacity <= 0) {
    return { maxProfit: 0, chosen: [] };
  }

  const n = packages.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (packages[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          packages[i - 1].profit + dp[i - 1][w - packages[i - 1].weight],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find chosen packages
  let res = dp[n][capacity];
  let w = capacity;
  let chosen = [];
  
  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      chosen.push(packages[i - 1]);
      res -= packages[i - 1].profit;
      w -= packages[i - 1].weight;
    }
  }
  
  return { 
    maxProfit: dp[n][capacity], 
    chosen: chosen.reverse() // Reverse to maintain original order
  };
}

// Helper function to calculate profit-to-weight ratio
export function calculateEfficiency(packages) {
  return packages.map(pkg => ({
    ...pkg,
    efficiency: pkg.profit / pkg.weight
  })).sort((a, b) => b.efficiency - a.efficiency);
}

// Greedy approach (not optimal but fast)
export function greedyKnapsack(packages, capacity) {
  const sortedPackages = calculateEfficiency(packages);
  let totalWeight = 0;
  let totalProfit = 0;
  let chosen = [];
  
  for (const pkg of sortedPackages) {
    if (totalWeight + pkg.weight <= capacity) {
      chosen.push(pkg);
      totalWeight += pkg.weight;
      totalProfit += pkg.profit;
    }
  }
  
  return { maxProfit: totalProfit, chosen };
}