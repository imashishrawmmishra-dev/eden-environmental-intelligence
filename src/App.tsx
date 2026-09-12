import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AskEngine } from './components/AskEngine';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { ResourceUniverseView } from './components/ResourceUniverseView';
import { LearnerMatrixView } from './components/LearnerMatrixView';
import { MultiPlatformHub } from './components/MultiPlatformHub';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'graph' | 'resources' | 'learner' | 'scaffolding'>('ask');
  const [aiMode, setAiMode] = useState<'offline' | 'live_ai'>('offline');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [conceptQuery, setConceptQuery] = useState<string>('');
  const [healthInfo, setHealthInfo] = useState<{
    status: string;
    version: string;
    nodesCount: number;
    edgesCount: number;
    resourcesCount: number;
    liveAiAvailable: boolean;
  } | null>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/v1/health');
      if (res.ok) {
        const data = await res.json();
        setHealthInfo(data);
      }
    } catch (err) {
      console.warn('Health check unreachable:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleNavigateToConcept = (conceptTitle: string) => {
    setConceptQuery(conceptTitle);
    setActiveTab('ask');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Primary App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiMode={aiMode}
        setAiMode={setAiMode}
        onOpenExport={() => setExportModalOpen(true)}
        healthInfo={healthInfo}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'ask' && (
          <AskEngine
            aiMode={aiMode}
            activeConceptQuery={conceptQuery}
            onClearConceptQuery={() => setConceptQuery('')}
            onNavigateToConcept={handleNavigateToConcept}
            onRefreshCompetencies={fetchHealth}
          />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraphView
            onSelectConceptToAsk={handleNavigateToConcept}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceUniverseView
            onSelectConceptToAsk={handleNavigateToConcept}
          />
        )}

        {activeTab === 'learner' && (
          <LearnerMatrixView
            onStudyConcept={handleNavigateToConcept}
          />
        )}

        {activeTab === 'scaffolding' && (
          <MultiPlatformHub />
        )}
      </main>

      {/* Portable JSON Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EDEN v5.2.0</span>
            <span>•</span>
            <span>Environmental Intelligence & Learning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI / Express API</span>
            <span>•</span>
            <span>SQLite Knowledge Graph</span>
            <span>•</span>
            <span>IPCC / WMO / EPA Mapped</span>
            <span>•</span>
            <span>COPPA/FERPA Educational Safe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
