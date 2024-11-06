import { nanoid } from 'nanoid';
import { gameConfig } from '../config/gameConfig';

export interface Resource {
  iron: number;
  kryptonite: number;
  energy: number;
}

export interface Storage {
  iron: number;
  kryptonite: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  baseProduction: number;
  baseEnergyCost: number;
  upgrading: boolean;
  upgradeTimeRemaining: number;
  baseCost: {
    iron: number;
    kryptonite: number;
  };
}

export interface Planet {
  id: string;
  name: string;
  totalSpaces: number;
  usedSpaces: number;
  buildings: Record<string, Building>;
  resources: Resource;
  storage: Storage;
}

export interface Research {
  id: string;
  name: string;
  level: number;
  effect: number;
  researching: boolean;
  researchTimeRemaining: number;
  baseCost: {
    iron: number;
    kryptonite: number;
  };
}

export interface GameState {
  planets: Planet[];
  currentPlanetId: string;
  research: Record<string, Research>;
  activeResearchId: string | null;
  colonizationCost: {
    iron: number;
    kryptonite: number;
  };
}

export const BUILDING_TYPES = {
  IRON_MINE: 'ironMine',
  KRYPTONITE_EXTRACTOR: 'kryptoniteExtractor',
  SOLAR_PLANT: 'solarPlant',
  IRON_STORAGE: 'ironStorage',
  KRYPTONITE_STORAGE: 'kryptoniteStorage',
} as const;

export const RESEARCH_TYPES = {
  PRODUCTION_EFFICIENCY: 'productionEfficiency',
  ENERGY_CONSUMPTION: 'energyConsumption',
  STORAGE_CAPACITY: 'storageCapacity',
} as const;

export function createNewPlanet(): Planet {
  const totalSpaces = Math.floor(Math.random() * 201) + 100; // Random between 100-300

  return {
    id: nanoid(),
    name: `Colony ${Math.floor(Math.random() * 1000)}`,
    totalSpaces,
    usedSpaces: 5,
    buildings: {
      [BUILDING_TYPES.IRON_MINE]: {
        id: BUILDING_TYPES.IRON_MINE,
        name: 'Iron Mine',
        level: 1,
        baseProduction: 100,
        baseEnergyCost: 50,
        upgrading: false,
        upgradeTimeRemaining: 0,
        baseCost: {
          iron: 100,
          kryptonite: 50,
        },
      },
      [BUILDING_TYPES.KRYPTONITE_EXTRACTOR]: {
        id: BUILDING_TYPES.KRYPTONITE_EXTRACTOR,
        name: 'Kryptonite Extractor',
        level: 1,
        baseProduction: 75,
        baseEnergyCost: 75,
        upgrading: false,
        upgradeTimeRemaining: 0,
        baseCost: {
          iron: 150,
          kryptonite: 75,
        },
      },
      [BUILDING_TYPES.SOLAR_PLANT]: {
        id: BUILDING_TYPES.SOLAR_PLANT,
        name: 'Solar Plant',
        level: 1,
        baseProduction: 200,
        baseEnergyCost: 0,
        upgrading: false,
        upgradeTimeRemaining: 0,
        baseCost: {
          iron: 200,
          kryptonite: 100,
        },
      },
      [BUILDING_TYPES.IRON_STORAGE]: {
        id: BUILDING_TYPES.IRON_STORAGE,
        name: 'Iron Storage',
        level: 1,
        baseProduction: 0,
        baseEnergyCost: 0,
        upgrading: false,
        upgradeTimeRemaining: 0,
        baseCost: {
          iron: 100,
          kryptonite: 50,
        },
      },
      [BUILDING_TYPES.KRYPTONITE_STORAGE]: {
        id: BUILDING_TYPES.KRYPTONITE_STORAGE,
        name: 'Kryptonite Storage',
        level: 1,
        baseProduction: 0,
        baseEnergyCost: 0,
        upgrading: false,
        upgradeTimeRemaining: 0,
        baseCost: {
          iron: 100,
          kryptonite: 50,
        },
      },
    },
    resources: { ...gameConfig.initialResources },
    storage: { ...gameConfig.initialStorage },
  };
}