import { Building, Planet } from '../types/game';

export function calculateUpgradeCost(building: Building) {
  return {
    iron: Math.floor(building.baseCost.iron * Math.pow(1.5, building.level - 1)),
    kryptonite: Math.floor(building.baseCost.kryptonite * Math.pow(1.5, building.level - 1)),
  };
}

export function canUpgradeBuilding(planet: Planet, building: Building): boolean {
  const upgradeCost = calculateUpgradeCost(building);
  
  return (
    !building.upgrading &&
    planet.usedSpaces + 1 <= planet.totalSpaces &&
    planet.resources.iron >= upgradeCost.iron &&
    planet.resources.kryptonite >= upgradeCost.kryptonite
  );
}