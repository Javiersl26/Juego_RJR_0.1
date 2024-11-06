/**
 * Master configuration file for game parameters
 * Modify these values to adjust game mechanics for testing
 */
export const gameConfig = {
  // Time multiplier for all construction/research times (2 = twice as fast, 0.5 = half speed)
  timeMultiplier: 10,

  // Initial resources for new planets
  initialResources: {
    iron: 5000,
    kryptonite: 2500,
    energy: 200,
  },

  // Initial storage capacity
  initialStorage: {
    iron: 10000,
    kryptonite: 10000,
  },

  // Base times in seconds
  baseTimes: {
    buildingUpgrade: 5,
    research: 5,
  },
};