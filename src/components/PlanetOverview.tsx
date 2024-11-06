import React from 'react';
import { Planet } from '../types/game';
import { Rocket, Battery, Database } from 'lucide-react';

interface PlanetOverviewProps {
  planet: Planet;
}

export function PlanetOverview({ planet }: PlanetOverviewProps) {
  const spaceUsagePercentage = (planet.usedSpaces / planet.totalSpaces) * 100;
  const energyFactor = Math.min(1, planet.resources.energy / Object.values(planet.buildings).reduce((acc, building) => 
    acc + (building.baseEnergyCost * building.level), 0));

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Rocket className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">{planet.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Battery className={`w-6 h-6 ${energyFactor === 1 ? 'text-green-400' : 'text-yellow-400'}`} />
          <span className="text-white">
            Energy Factor: {Math.floor(energyFactor * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Spaces</span>
            <span className="text-white">
              {planet.usedSpaces} / {planet.totalSpaces}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${spaceUsagePercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Storage</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Iron</span>
              <div className="text-white">
                {Math.floor(planet.resources.iron).toLocaleString()} / {Math.floor(planet.storage.iron).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Kryptonite</span>
              <div className="text-white">
                {Math.floor(planet.resources.kryptonite).toLocaleString()} / {Math.floor(planet.storage.kryptonite).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}