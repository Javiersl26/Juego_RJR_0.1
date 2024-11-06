import { create } from 'zustand';
import { GameState, Planet, Building, Research, BUILDING_TYPES, RESEARCH_TYPES, createNewPlanet } from '../types/game';
import { calculateUpgradeCost, canUpgradeBuilding } from '../utils/gameLogic';
import { nanoid } from 'nanoid';
import { gameConfig } from '../config/gameConfig';

const INITIAL_RESEARCH: Record<string, Research> = {
  [RESEARCH_TYPES.PRODUCTION_EFFICIENCY]: {
    id: RESEARCH_TYPES.PRODUCTION_EFFICIENCY,
    name: 'Production Efficiency',
    level: 1,
    effect: 0.1, // 10% increase per level
    researching: false,
    researchTimeRemaining: 0,
    baseCost: {
      iron: 1000,
      kryptonite: 500,
    },
  },
  [RESEARCH_TYPES.ENERGY_CONSUMPTION]: {
    id: RESEARCH_TYPES.ENERGY_CONSUMPTION,
    name: 'Energy Optimization',
    level: 1,
    effect: 0.05, // 5% reduction per level
    researching: false,
    researchTimeRemaining: 0,
    baseCost: {
      iron: 1500,
      kryptonite: 750,
    },
  },
  [RESEARCH_TYPES.STORAGE_CAPACITY]: {
    id: RESEARCH_TYPES.STORAGE_CAPACITY,
    name: 'Storage Expansion',
    level: 1,
    effect: 0.2, // 20% increase per level
    researching: false,
    researchTimeRemaining: 0,
    baseCost: {
      iron: 2000,
      kryptonite: 1000,
    },
  },
};

const INITIAL_STATE: GameState = {
  planets: [createNewPlanet()],
  currentPlanetId: '',
  research: INITIAL_RESEARCH,
  activeResearchId: null,
  colonizationCost: {
    iron: 10000,
    kryptonite: 5000,
  },
};

// Set the currentPlanetId to the first planet's ID
INITIAL_STATE.currentPlanetId = INITIAL_STATE.planets[0].id;

interface GameStore extends GameState {
  selectPlanet: (planetId: string) => void;
  colonizeNewPlanet: () => void;
  updateResources: () => void;
  upgradeBuilding: (planetId: string, buildingId: string) => void;
  startResearch: (researchId: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  
  selectPlanet: (planetId: string) => {
    set({ currentPlanetId: planetId });
  },

  colonizeNewPlanet: () => {
    const state = get();
    if (state.planets.length >= 10) return;

    const currentPlanet = state.planets.find(p => p.id === state.currentPlanetId);
    if (!currentPlanet) return;

    if (
      currentPlanet.resources.iron < state.colonizationCost.iron ||
      currentPlanet.resources.kryptonite < state.colonizationCost.kryptonite
    ) return;

    const newPlanet = createNewPlanet();

    set(state => ({
      planets: [...state.planets, newPlanet],
      currentPlanetId: newPlanet.id,
      colonizationCost: {
        iron: Math.floor(state.colonizationCost.iron * 1.5),
        kryptonite: Math.floor(state.colonizationCost.kryptonite * 1.5),
      },
    }));
  },

  updateResources: () => {
    set(state => {
      const updatedPlanets = state.planets.map(planet => {
        // Calculate available energy (this is instant, not per hour)
        const energyProduction = planet.buildings[BUILDING_TYPES.SOLAR_PLANT].baseProduction * 
          planet.buildings[BUILDING_TYPES.SOLAR_PLANT].level;

        const energyEfficiency = 1 - (state.research[RESEARCH_TYPES.ENERGY_CONSUMPTION].level - 1) * 
          state.research[RESEARCH_TYPES.ENERGY_CONSUMPTION].effect;

        const totalEnergyConsumption = Object.values(planet.buildings).reduce(
          (acc, building) => acc + (building.baseEnergyCost * building.level * energyEfficiency),
          0
        );

        const energyFactor = Math.min(1, energyProduction / (totalEnergyConsumption || 1));
        
        // Production per hour affected by research and energy factor
        const productionEfficiency = 1 + (state.research[RESEARCH_TYPES.PRODUCTION_EFFICIENCY].level - 1) * 
          state.research[RESEARCH_TYPES.PRODUCTION_EFFICIENCY].effect;

        const ironPerHour = planet.buildings[BUILDING_TYPES.IRON_MINE].baseProduction * 
          planet.buildings[BUILDING_TYPES.IRON_MINE].level * 
          energyFactor * productionEfficiency;

        const kryptonitePerHour = planet.buildings[BUILDING_TYPES.KRYPTONITE_EXTRACTOR].baseProduction * 
          planet.buildings[BUILDING_TYPES.KRYPTONITE_EXTRACTOR].level * 
          energyFactor * productionEfficiency;

        // Convert production per hour to production per tick (100ms)
        const ironPerTick = (ironPerHour / 36000) * gameConfig.timeMultiplier;
        const kryptonitePerTick = (kryptonitePerHour / 36000) * gameConfig.timeMultiplier;

        const storageEfficiency = 1 + (state.research[RESEARCH_TYPES.STORAGE_CAPACITY].level - 1) * 
          state.research[RESEARCH_TYPES.STORAGE_CAPACITY].effect;

        const baseStorage = {
          iron: Math.floor(10000 * Math.pow(1.5, planet.buildings[BUILDING_TYPES.IRON_STORAGE].level - 1)),
          kryptonite: Math.floor(10000 * Math.pow(1.5, planet.buildings[BUILDING_TYPES.KRYPTONITE_STORAGE].level - 1)),
        };

        const maxStorage = {
          iron: Math.floor(baseStorage.iron * storageEfficiency),
          kryptonite: Math.floor(baseStorage.kryptonite * storageEfficiency),
        };

        return {
          ...planet,
          resources: {
            iron: Math.min(
              planet.resources.iron + ironPerTick,
              maxStorage.iron
            ),
            kryptonite: Math.min(
              planet.resources.kryptonite + kryptonitePerTick,
              maxStorage.kryptonite
            ),
            energy: energyProduction,
          },
          storage: maxStorage,
        };
      });

      // Process building upgrades
      const planetsWithUpgrades = updatedPlanets.map(planet => ({
        ...planet,
        buildings: Object.fromEntries(
          Object.entries(planet.buildings).map(([id, building]) => {
            if (!building.upgrading) return [id, building];
            
            const newTimeRemaining = building.upgradeTimeRemaining - 0.1;
            if (newTimeRemaining <= 0) {
              return [id, {
                ...building,
                level: building.level + 1,
                upgrading: false,
                upgradeTimeRemaining: 0,
              }];
            }
            
            return [id, {
              ...building,
              upgradeTimeRemaining: newTimeRemaining,
            }];
          })
        ),
      }));

      // Process active research
      let updatedResearch = { ...state.research };
      let updatedActiveResearchId = state.activeResearchId;

      if (state.activeResearchId) {
        const activeResearch = updatedResearch[state.activeResearchId];
        const newTimeRemaining = activeResearch.researchTimeRemaining - 0.1;

        if (newTimeRemaining <= 0) {
          updatedResearch = {
            ...updatedResearch,
            [state.activeResearchId]: {
              ...activeResearch,
              level: activeResearch.level + 1,
              researching: false,
              researchTimeRemaining: 0,
            },
          };
          updatedActiveResearchId = null;
        } else {
          updatedResearch = {
            ...updatedResearch,
            [state.activeResearchId]: {
              ...activeResearch,
              researchTimeRemaining: newTimeRemaining,
            },
          };
        }
      }

      return {
        ...state,
        planets: planetsWithUpgrades,
        research: updatedResearch,
        activeResearchId: updatedActiveResearchId,
      };
    });
  },

  upgradeBuilding: (planetId: string, buildingId: string) => {
    const state = get();
    const planet = state.planets.find(p => p.id === planetId);
    if (!planet) return;

    const building = planet.buildings[buildingId];
    if (!building || building.upgrading) return;

    if (!canUpgradeBuilding(planet, building)) return;

    const upgradeCost = calculateUpgradeCost(building);

    set(state => ({
      planets: state.planets.map(p => {
        if (p.id !== planetId) return p;

        return {
          ...p,
          usedSpaces: p.usedSpaces + 1,
          resources: {
            ...p.resources,
            iron: p.resources.iron - upgradeCost.iron,
            kryptonite: p.resources.kryptonite - upgradeCost.kryptonite,
          },
          buildings: {
            ...p.buildings,
            [buildingId]: {
              ...p.buildings[buildingId],
              upgrading: true,
              upgradeTimeRemaining: gameConfig.baseTimes.buildingUpgrade,
            },
          },
        };
      }),
    }));
  },

  startResearch: (researchId: string) => {
    const state = get();
    if (state.activeResearchId) return;

    const research = state.research[researchId];
    if (!research || research.researching) return;

    const currentPlanet = state.planets.find(p => p.id === state.currentPlanetId);
    if (!currentPlanet) return;

    const researchCost = {
      iron: Math.floor(research.baseCost.iron * Math.pow(1.5, research.level - 1)),
      kryptonite: Math.floor(research.baseCost.kryptonite * Math.pow(1.5, research.level - 1)),
    };

    if (
      currentPlanet.resources.iron < researchCost.iron ||
      currentPlanet.resources.kryptonite < researchCost.kryptonite
    ) return;

    set(state => ({
      activeResearchId: researchId,
      planets: state.planets.map(p => {
        if (p.id !== state.currentPlanetId) return p;

        return {
          ...p,
          resources: {
            ...p.resources,
            iron: p.resources.iron - researchCost.iron,
            kryptonite: p.resources.kryptonite - researchCost.kryptonite,
          },
        };
      }),
      research: {
        ...state.research,
        [researchId]: {
          ...state.research[researchId],
          researching: true,
          researchTimeRemaining: gameConfig.baseTimes.research,
        },
      },
    }));
  },
}));