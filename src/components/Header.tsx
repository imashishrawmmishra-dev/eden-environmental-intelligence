import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Network, 
  BookOpen, 
  Award, 
  Package, 
  Download, 
  CheckCircle2, 
  Flame,
  Layers,
  Leaf
} from 'lucide-react';

interface Props {
  activeTab: 'ask' | 'graph' | 'resources' | 'learner' | 'scaffolding';
  setActiveTab: (tab: 'ask' | 'graph' | 'resources' | 'learner' | 'scaffolding') => void;
  aiMode: 'offline' | 'live_ai';
  setAiMode: (mode: 'offline' | 'live_ai') => void;
  onOpenExport: () => void;
  healthInfo: {
    status: string;
    version: string;
    nodesCount: number;
    edgesCount: number;
    resourcesCount: number;
    liveAiAvailable: boolean;
  } | null;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  aiMode,
  setAiMode,
  onOpenExport,
  healthInfo
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40" id="eden-main-header">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  EDEN
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-medium">
                    v5.2.0
                  </span>
                </h1>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline font-medium">
                  Environmental Intelligence & Learning
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Explore • Discover • Educate • Nurture
              </p>
            </div>
          </div>

          {/* Engine Status & Mode Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Health pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-slate-400">Graph:</span>
              <span className="font-semibold text-emerald-400">{healthInfo?.nodesCount || 12} nodes</span>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-cyan-400">{healthInfo?.edgesCount || 13} edges</span>
            </div>

            {/* Offline vs Live AI Mode Switcher */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium" id="mode-switcher">
              <button
                type="button"
                onClick={() => setAiMode('offline')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  aiMode === 'offline'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="100% offline knowledge graph traversal engine"
                id="btn-mode-offline"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Offline Engine</span>
              </button>
              <button
                type="button"
                onClick={() => setAiMode('live_ai')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  aiMode === 'live_ai'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Augmented with Gemini AI model"
                id="btn-mode-live-ai"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Live AI Mode</span>
              </button>
            </div>

            {/* Portable Export JSON */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
              id="btn-export-json"
              title="Inspect or download portable knowledge_graph.json, sources.json, resource_universe.json"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export Portable JSON</span>
              <span className="sm:hidden">JSON</span>
            </button>
          </div>

        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs" id="eden-nav-tabs">
            
            <button
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'ask'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              id="tab-ask"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Intelligence Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">/api/v1/ask</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'graph'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              id="tab-graph"
            >
              <Network className="w-4 h-4" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'resources'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              id="tab-resources"
            >
              <BookOpen className="w-4 h-4" />
              <span>Curated Resource Universe</span>
            </button>

            <button
              onClick={() => setActiveTab('learner')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'learner'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              id="tab-learner"
            >
              <Award className="w-4 h-4" />
              <span>Learner Competency Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('scaffolding')}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'scaffolding'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              id="tab-scaffolding"
            >
              <Package className="w-4 h-4" />
              <span>Multi-Platform Delivery & Launch Gate</span>
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
};
