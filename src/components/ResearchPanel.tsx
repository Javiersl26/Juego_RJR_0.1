import React from 'react';
import { Research } from '../types/game';
import { Microscope, Timer, ArrowUpCircle } from 'lucide-react';

interface ResearchPanelProps {
  research: Research;
  onResearch: () => void;
  canResearch: boolean;
  active: boolean;
}

export function ResearchPanel({ research, onResearch, canResearch, active }: ResearchPanelProps) {
  const researchCostIron = Math.floor(research.baseCost.iron * Math.pow(1.5, research.level - 1));
  const researchCostKryptonite = Math.floor(research.baseCost.kryptonite * Math.pow(1.5, research.level - 1));

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Microscope className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{research.name}</h3>
            <p className="text-sm text-gray-400">Level {research.level}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Effect</span>
          <span className="text-white">+{Math.floor(research.effect * research.level * 100)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Research Cost</span>
          <div className="text-right">
            <div className="text-white">{researchCostIron.toLocaleString()} Iron</div>
            <div className="text-white">{researchCostKryptonite.toLocaleString()} Kryptonite</div>
          </div>
        </div>
      </div>

      {active ? (
        <div className="flex items-center justify-center space-x-2 bg-slate-700 rounded p-2">
          <Timer className="w-4 h-4 text-purple-400 animate-spin" />
          <span className="text-sm text-gray-300">
            Researching... {Math.ceil(research.researchTimeRemaining)}s
          </span>
        </div>
      ) : (
        <button
          onClick={onResearch}
          disabled={!canResearch}
          className={`w-full flex items-center justify-center space-x-2 rounded p-2 transition-colors
            ${canResearch 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-slate-700 text-gray-400 cursor-not-allowed'
            }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Research</span>
        </button>
      )}
    </div>
  );
}