import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  FileText, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';
import { CURATED_RESOURCES, KNOWLEDGE_NODES } from '../data/knowledgeGraph';
import { CuratedResource } from '../types';

interface Props {
  onSelectConceptToAsk: (conceptTitle: string) => void;
}

export const ResourceUniverseView: React.FC<Props> = ({ onSelectConceptToAsk }) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const organizations = ['all', 'IPCC', 'WMO', 'UNEP', 'NOAA', 'EPA', 'IUCN', 'Ramsar', 'UNFCCC'];

  const filteredResources = useMemo(() => {
    return CURATED_RESOURCES.filter(r => {
      const matchOrg = selectedOrg === 'all' || r.organization === selectedOrg;
      const matchTier = selectedTier === 'all' || r.reliabilityTier === selectedTier;
      const matchSearch = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.organization.toLowerCase().includes(searchQuery.toLowerCase());
      return matchOrg && matchTier && matchSearch;
    });
  }, [selectedOrg, selectedTier, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="resource-universe-view">
      
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Curated Environmental Resource Universe</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified peer-reviewed registries, observation bulletins, and international standards (IPCC, WMO, EPA, IUCN)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports, standards, bulletins..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 font-medium">Organization:</span>
          {organizations.map(org => (
            <button
              key={org}
              onClick={() => setSelectedOrg(org)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                selectedOrg === org
                  ? 'bg-emerald-600 border-emerald-500 text-white font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {org === 'all' ? 'All Authorities' : org}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.map((res: CuratedResource) => {
          const linkedNodes = KNOWLEDGE_NODES.filter(n => res.conceptIds.includes(n.id));

          return (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                
                {/* Badges */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {res.organization}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {res.type}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {res.reliabilityTier}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white leading-snug">
                  {res.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.summary}
                </p>

                {/* Mapped Knowledge Graph Nodes */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5">
                    Mapped Knowledge Graph Concepts:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {linkedNodes.map(node => (
                      <button
                        key={node.id}
                        onClick={() => onSelectConceptToAsk(node.title)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border border-slate-800 transition-colors"
                      >
                        {node.title}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom footer: License & Portal Link */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-500 truncate max-w-[240px]">
                  {res.license}
                </span>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
