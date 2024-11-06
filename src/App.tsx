import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { PlanetOverview } from './components/PlanetOverview';
import { BuildingCard } from './components/BuildingCard';
import { ResearchPanel } from './components/ResearchPanel';
import { PlanetSelector } from './components/PlanetSelector';
import { GlobeIcon, Microscope } from 'lucide-react';
import { canUpgradeBuilding } from './utils/gameLogic';

export default function App() {
  const { 
    planets, 
    currentPlanetId,
    colonizationCost,
    research,
    activeResearchId,
    upgradeBuilding, 
    startResearch,
    updateResources,
    selectPlanet,
    colonizeNewPlanet,
  } = useGameStore();
  
  const currentPlanet = planets.find(p => p.id === currentPlanetId)!;

  useEffect(() => {
    const interval = setInterval(() => {
      updateResources();
    }, 100);

    return () => clearInterval(interval);
  }, [updateResources]);

  const handleUpgradeBuilding = (buildingId: string) => {
    upgradeBuilding(currentPlanetId, buildingId);
  };

  const handleStartResearch = (researchId: string) => {
    startResearch(researchId);
  };

  const canColonize = 
    planets.length < 10 && 
    currentPlanet.resources.iron >= colonizationCost.iron &&
    currentPlanet.resources.kryptonite >= colonizationCost.kryptonite;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GlobeIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Space Invasion</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <PlanetSelector
            planets={planets}
            currentPlanetId={currentPlanetId}
            onSelectPlanet={selectPlanet}
            onColonize={colonizeNewPlanet}
            canColonize={canColonize}
            colonizationCost={colonizationCost}
          />

          <PlanetOverview planet={currentPlanet} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(currentPlanet.buildings).map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                onUpgrade={() => handleUpgradeBuilding(building.id)}
                canUpgrade={canUpgradeBuilding(currentPlanet, building)}
              />
            ))}
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <Microscope className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold">Research Lab</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(research).map((r) => (
                <ResearchPanel
                  key={r.id}
                  research={r}
                  onResearch={() => handleStartResearch(r.id)}
                  canResearch={!activeResearchId && currentPlanet.resources.iron >= r.baseCost.iron && currentPlanet.resources.kryptonite >= r.baseCost.kryptonite}
                  active={r.id === activeResearchId}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}