import React from 'react';
import { Planet } from '../types/game';
import { Globe, Plus } from 'lucide-react';

interface PlanetSelectorProps {
  planets: Planet[];
  currentPlanetId: string;
  onSelectPlanet: (id: string) => void;
  onColonize: () => void;
  canColonize: boolean;
  colonizationCost: {
    iron: number;
    kryptonite: number;
  };
}

export function PlanetSelector({ 
  planets, 
  currentPlanetId, 
  onSelectPlanet, 
  onColonize,
  canColonize,
  colonizationCost,
}: PlanetSelectorProps) {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
      {planets.map((planet) => (
        <button
          key={planet.id}
          onClick={() => onSelectPlanet(planet.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            planet.id === currentPlanetId
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{planet.name}</span>
        </button>
      ))}
      
      {planets.length < 10 && (
        <button
          onClick={onColonize}
          disabled={!canColonize}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            canColonize
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-slate-700 text-gray-400 cursor-not-allowed'
          }`}
          title={`Cost: ${Math.floor(colonizationCost.iron).toLocaleString()} Iron, ${Math.floor(colonizationCost.kryptonite).toLocaleString()} Kryptonite`}
        >
          <Plus className="w-4 h-4" />
          <span>New Colony</span>
        </button>
      )}
    </div>
  );
}