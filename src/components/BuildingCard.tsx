import React from 'react';
import { Building } from '../types/game';
import { 
  Factory, 
  Zap, 
  ArrowUpCircle,
  Timer,
} from 'lucide-react';

interface BuildingCardProps {
  building: Building;
  onUpgrade: () => void;
  canUpgrade: boolean;
}

export function BuildingCard({ building, onUpgrade, canUpgrade }: BuildingCardProps) {
  const upgradeCostIron = Math.floor(building.baseCost.iron * Math.pow(1.5, building.level - 1));
  const upgradeCostKryptonite = Math.floor(building.baseCost.kryptonite * Math.pow(1.5, building.level - 1));

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Factory className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{building.name}</h3>
            <p className="text-sm text-gray-400">Level {building.level}</p>
          </div>
        </div>
        {building.baseEnergyCost > 0 && (
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">
              {building.baseEnergyCost * building.level}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Production</span>
          <span className="text-white">
            {building.baseProduction * building.level}/h
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Upgrade Cost</span>
          <div className="text-right">
            <div className="text-white">{upgradeCostIron.toLocaleString()} Iron</div>
            <div className="text-white">{upgradeCostKryptonite.toLocaleString()} Kryptonite</div>
          </div>
        </div>
      </div>

      {building.upgrading ? (
        <div className="flex items-center justify-center space-x-2 bg-slate-700 rounded p-2">
          <Timer className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-sm text-gray-300">
            Upgrading... {Math.ceil(building.upgradeTimeRemaining)}s
          </span>
        </div>
      ) : (
        <button
          onClick={onUpgrade}
          disabled={!canUpgrade}
          className={`w-full flex items-center justify-center space-x-2 rounded p-2 transition-colors
            ${canUpgrade 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-700 text-gray-400 cursor-not-allowed'
            }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Upgrade</span>
        </button>
      )}
    </div>
  );
}