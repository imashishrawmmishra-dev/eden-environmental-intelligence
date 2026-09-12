import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Info,
  X
} from 'lucide-react';
import { KnowledgeNode, KnowledgeEdge, ConceptCategory, EdgeRelation } from '../types';
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from '../data/knowledgeGraph';

interface Props {
  onSelectConceptToAsk: (conceptTitle: string) => void;
}

const CATEGORY_COLORS: Record<ConceptCategory, { bg: string; text: string; border: string; circle: string }> = {
  atmosphere: { bg: 'bg-sky-950/40', text: 'text-sky-300', border: 'border-sky-700/60', circle: '#38bdf8' },
  hydrosphere: { bg: 'bg-cyan-950/40', text: 'text-cyan-300', border: 'border-cyan-700/60', circle: '#06b6d4' },
  biosphere: { bg: 'bg-emerald-950/40', text: 'text-emerald-300', border: 'border-emerald-700/60', circle: '#10b981' },
  pollution_indicators: { bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-700/60', circle: '#f59e0b' },
  environmental_policy: { bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-700/60', circle: '#a855f7' },
  careers: { bg: 'bg-blue-950/40', text: 'text-blue-300', border: 'border-blue-700/60', circle: '#3b82f6' },
  exams: { bg: 'bg-rose-950/40', text: 'text-rose-300', border: 'border-rose-700/60', circle: '#f43f5e' }
};

export const KnowledgeGraphView: React.FC<Props> = ({ onSelectConceptToAsk }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(KNOWLEDGE_NODES[0]);

  // Node positions fixed for aesthetically balanced 2D network visualization
  const nodeCoordinates: Record<string, { x: number; y: number }> = {
    bod: { x: 260, y: 140 },
    do: { x: 440, y: 140 },
    streeter_phelps: { x: 350, y: 260 },
    eutrophication: { x: 170, y: 260 },
    clean_water_act: { x: 190, y: 400 },
    career_env_engineer: { x: 370, y: 420 },
    exam_apes: { x: 540, y: 260 },
    radiative_forcing: { x: 680, y: 140 },
    carbon_budget: { x: 740, y: 270 },
    paris_agreement: { x: 710, y: 410 },
    island_biogeography: { x: 890, y: 190 },
    keystone_species: { x: 890, y: 350 }
  };

  const filteredNodes = useMemo(() => {
    return KNOWLEDGE_NODES.filter(node => {
      const matchCat = selectedCategory === 'all' || node.category === selectedCategory;
      const matchSearch = !searchQuery || node.title.toLowerCase().includes(searchQuery.toLowerCase()) || node.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return KNOWLEDGE_EDGES.filter(edge => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target));
  }, [activeNodeIds]);

  // Edges linked to selected node
  const selectedNodeEdges = useMemo(() => {
    if (!selectedNode) return [];
    return KNOWLEDGE_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => {
      const neighborId = e.source === selectedNode.id ? e.target : e.source;
      const neighbor = KNOWLEDGE_NODES.find(n => n.id === neighborId);
      return {
        edge: e,
        neighbor,
        isOutgoing: e.source === selectedNode.id
      };
    });
  }, [selectedNode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="knowledge-graph-view">
      
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Environmental Concept Graph</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore semantic relationships (contains, interacts_with, regulated_by, exam_relevance, mitigates)
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search concepts or indicators..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              id="select-graph-category"
            >
              <option value="all">All Domains (Entire Graph)</option>
              <option value="atmosphere">Atmosphere & GHGs</option>
              <option value="hydrosphere">Hydrosphere & Water Systems</option>
              <option value="biosphere">Biosphere & Biodiversity</option>
              <option value="pollution_indicators">Pollution Indicators (BOD/DO)</option>
              <option value="environmental_policy">Environmental Policy & Treaties</option>
              <option value="careers">Careers & Practice</option>
              <option value="exams">Exams & Standards</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-3 flex-wrap text-[11px]">
          <span className="text-slate-500 font-medium">Domain Legend:</span>
          {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all ${style.bg} ${style.border} ${style.text} ${selectedCategory === cat ? 'ring-2 ring-white/20' : 'opacity-80 hover:opacity-100'}`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.circle }}></span>
              <span className="capitalize">{cat.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-2xl min-h-[500px]">
          
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            Click any concept node to inspect its mechanics, formulas, and connections
          </div>

          <svg className="w-full h-[520px]" viewBox="100 80 880 400" id="eden-concept-network-svg">
            <defs>
              <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="14" refY="2.5" orient="auto">
                <polygon points="0 0, 7 2.5, 0 5" fill="#475569" />
              </marker>
              <marker id="arrowhead-active" markerWidth="7" markerHeight="5" refX="14" refY="2.5" orient="auto">
                <polygon points="0 0, 7 2.5, 0 5" fill="#10b981" />
              </marker>
            </defs>

            {/* Render Edges */}
            {filteredEdges.map(edge => {
              const src = nodeCoordinates[edge.source];
              const tgt = nodeCoordinates[edge.target];
              if (!src || !tgt) return null;

              const isConnectedToSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

              return (
                <g key={edge.id} className="cursor-pointer">
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnectedToSelected ? '#10b981' : '#334155'}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                    strokeDasharray={edge.relation === 'exam_relevance' ? '4,4' : undefined}
                    markerEnd={isConnectedToSelected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />
                  {/* Relation label at midpoint */}
                  <rect
                    x={(src.x + tgt.x) / 2 - 28}
                    y={(src.y + tgt.y) / 2 - 8}
                    width="56"
                    height="14"
                    rx="3"
                    fill="#0f172a"
                    stroke={isConnectedToSelected ? '#10b981' : '#1e293b'}
                    strokeWidth="0.8"
                  />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 + 3}
                    textAnchor="middle"
                    fill={isConnectedToSelected ? '#34d399' : '#64748b'}
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    {edge.relation}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map(node => {
              const coords = nodeCoordinates[node.id] || { x: 500, y: 250 };
              const isSelected = selectedNode?.id === node.id;
              const catStyle = CATEGORY_COLORS[node.category];

              return (
                <g
                  key={node.id}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Selection pulse ring */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="19"
                    fill="#0f172a"
                    stroke={isSelected ? '#34d399' : catStyle.circle}
                    strokeWidth={isSelected ? 3 : 1.8}
                    className="transition-all group-hover:scale-110"
                  />

                  {/* Inner center dot */}
                  <circle
                    r="7"
                    fill={catStyle.circle}
                    opacity="0.9"
                  />

                  {/* Node Title label */}
                  <text
                    y="32"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    {node.title.length > 20 ? node.title.slice(0, 18) + '...' : node.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Detail Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {selectedNode ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5" id="node-detail-card">
              
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[selectedNode.category].bg} ${CATEGORY_COLORS[selectedNode.category].border} ${CATEGORY_COLORS[selectedNode.category].text}`}>
                    {selectedNode.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">
                    {selectedNode.title}
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedNode.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                {selectedNode.summary}
              </p>

              {/* Formulation */}
              {selectedNode.formulaOrMetric && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Formula / Metric
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-emerald-300 text-xs border border-slate-800 overflow-x-auto">
                    {selectedNode.formulaOrMetric}
                  </div>
                </div>
              )}

              {/* Exam & Career Relevance */}
              <div className="space-y-2 text-xs">
                {selectedNode.examRelevance && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <span className="font-semibold text-amber-400 block mb-0.5">Exam Relevance:</span>
                    <span className="text-slate-300">{selectedNode.examRelevance}</span>
                  </div>
                )}
                {selectedNode.careerRelevance && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <span className="font-semibold text-blue-400 block mb-0.5">Career Application:</span>
                    <span className="text-slate-300">{selectedNode.careerRelevance}</span>
                  </div>
                )}
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Knowledge Graph Edges ({selectedNodeEdges.length})
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedNodeEdges.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => item.neighbor && setSelectedNode(item.neighbor)}
                      className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-colors text-xs flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[10px] uppercase font-mono text-emerald-400 block">
                          {item.edge.relation}
                        </span>
                        <span className="text-slate-200 font-medium truncate block">
                          {item.neighbor?.title || 'External Concept'}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Ask button */}
              <button
                type="button"
                onClick={() => onSelectConceptToAsk(selectedNode.title)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/50"
                id="btn-inspect-ask-eden"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask EDEN about {selectedNode.title}</span>
              </button>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
              Select any node in the graph to view details and scientific formulations.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
