import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Share2, 
  HelpCircle, 
  Sliders, 
  Compass, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { AskResponse, IntentType } from '../types';
import { EnvironmentalSimulator } from './EnvironmentalSimulator';

interface Props {
  aiMode: 'offline' | 'live_ai';
  activeConceptQuery?: string;
  onClearConceptQuery?: () => void;
  onNavigateToConcept?: (conceptId: string) => void;
  onRefreshCompetencies?: () => void;
}

const SAMPLE_PROMPTS = [
  'What is the relationship between BOD and Dissolved Oxygen (DO) in aquatic ecosystems?',
  'How does Streeter-Phelps oxygen sag model river pollution downstream?',
  'Explain IPCC AR6 carbon budget vs Paris Agreement 1.5C target',
  'How do wildlife corridors mitigate Island Biogeography habitat fragmentation?',
  'Clean Water Act NPDES permit regulations on municipal wastewater discharge',
  'Environmental Engineering career roadmap and PE licensure requirements'
];

export const AskEngine: React.FC<Props> = ({ 
  aiMode, 
  activeConceptQuery,
  onClearConceptQuery,
  onNavigateToConcept,
  onRefreshCompetencies 
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [activeActionTab, setActiveActionTab] = useState<'learn' | 'connect' | 'practice' | 'simulate' | 'act'>('learn');
  
  // Practice question interaction
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceSuccess, setPracticeSuccess] = useState<boolean | null>(null);
  const [simulationFeedback, setSimulationFeedback] = useState<string | null>(null);

  // Initial prompt on load
  useEffect(() => {
    if (activeConceptQuery && activeConceptQuery.trim()) {
      setQuery(activeConceptQuery);
      handleAsk(activeConceptQuery);
      onClearConceptQuery?.();
    } else {
      handleAsk(SAMPLE_PROMPTS[0]);
    }
  }, []);

  // React to cross-tab concept navigation queries
  useEffect(() => {
    if (activeConceptQuery && activeConceptQuery.trim()) {
      setQuery(activeConceptQuery);
      handleAsk(activeConceptQuery);
      onClearConceptQuery?.();
    }
  }, [activeConceptQuery]);

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim()) return;
    setLoading(true);
    setSelectedPracticeOption(null);
    setPracticeSubmitted(false);
    setPracticeSuccess(null);
    setSimulationFeedback(null);

    try {
      const res = await fetch('/api/v1/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToAsk,
          mode: aiMode
        })
      });

      if (!res.ok) {
        throw new Error('API ask failed with status ' + res.status);
      }

      const data: AskResponse = await res.json();
      setResponse(data);
      onRefreshCompetencies?.();
    } catch (err) {
      console.error('Failed to ask EDEN:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  const handlePracticeSubmit = () => {
    if (selectedPracticeOption === null || !response) return;
    const isCorrect = selectedPracticeOption === response.suggestedActions.practice.correctIndex;
    setPracticeSubmitted(true);
    setPracticeSuccess(isCorrect);

    // Record learning event
    fetch('/api/v1/learner/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conceptId: response.primaryNodes[0]?.id || 'bod',
        actionTaken: 'practiced',
        scoreDelta: isCorrect ? 5 : 2
      })
    }).then(() => onRefreshCompetencies?.());
  };

  const handleSimulateLog = () => {
    if (!response) return;
    fetch('/api/v1/learner/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conceptId: response.primaryNodes[0]?.id || 'bod',
        actionTaken: 'simulated',
        scoreDelta: 4
      })
    }).then(() => {
      onRefreshCompetencies?.();
      setSimulationFeedback('Simulation exercise logged to your Learner Competency profile (+4 mastery score)!');
      setTimeout(() => setSimulationFeedback(null), 5000);
    });
  };

  const getIntentColor = (intent: IntentType) => {
    switch (intent) {
      case 'learning': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'policy': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'exam': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'lab': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'career': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'research': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="ask-engine-view">
      
      {/* Search & Prompt Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask EDEN about environmental indicators (BOD/DO, carbon budget, IPCC AR6, policy treaties, exam problems)..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 pl-11 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                id="ask-query-input"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 shrink-0 cursor-pointer"
              id="btn-submit-ask"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Ask EDEN</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample Prompt Chips */}
        <div className="mt-3.5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Try asking:</span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(prompt);
                handleAsk(prompt);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors text-left"
            >
              {prompt.length > 55 ? prompt.slice(0, 52) + '...' : prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Layout */}
      {response && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Center: Intelligence Answer & Next Actions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header: Intent Classification & Mode Badges */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Classified Intent:</span>
                <span className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full border ${getIntentColor(response.intent)}`}>
                  {response.intent}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ({Math.round(response.intentConfidence * 100)}% confidence)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                  response.mode === 'live_ai_grounded'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {response.mode === 'live_ai_grounded' ? '✨ Live AI Grounded (Gemini 3.8)' : '⚡ Offline Knowledge Graph Mode'}
                </span>
              </div>
            </div>

            {/* AI Mode Fallback Banner */}
            {response.fallbackReason && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-semibold text-amber-300">Live AI Notice: </span>
                  <span>{response.fallbackReason}</span>
                </div>
              </div>
            )}

            {/* Simulation Feedback Banner */}
            {simulationFeedback && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-medium">{simulationFeedback}</span>
              </div>
            )}

            {/* Answer Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4" id="eden-answer-box">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Environmental Intelligence Synthesis</span>
              </div>

              <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {response.answer}
              </div>

              {/* Formula Callout if available */}
              {response.primaryNodes[0]?.formulaOrMetric && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400 font-medium mb-1">Mathematical / Regulatory Formulation:</div>
                  <div className="font-mono text-emerald-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {response.primaryNodes[0].formulaOrMetric}
                  </div>
                </div>
              )}
            </div>

            {/* 5 NEXT ACTIONS WORKFLOW CONTAINER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="eden-next-actions-container">
              
              {/* Action Tabs Header */}
              <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Suggested Next Actions (Pedagogical Flow)</span>
                  </div>

                  {/* 5 Action Tabs */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                    <button
                      onClick={() => setActiveActionTab('learn')}
                      className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        activeActionTab === 'learn' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      id="action-tab-learn"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>1. Learn</span>
                    </button>

                    <button
                      onClick={() => setActiveActionTab('connect')}
                      className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        activeActionTab === 'connect' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      id="action-tab-connect"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>2. Connect</span>
                    </button>

                    <button
                      onClick={() => setActiveActionTab('practice')}
                      className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        activeActionTab === 'practice' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      id="action-tab-practice"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>3. Practice</span>
                    </button>

                    <button
                      onClick={() => setActiveActionTab('simulate')}
                      className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        activeActionTab === 'simulate' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      id="action-tab-simulate"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>4. Simulate</span>
                    </button>

                    <button
                      onClick={() => setActiveActionTab('act')}
                      className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        activeActionTab === 'act' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      id="action-tab-act"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>5. Act</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                
                {/* 1. LEARN */}
                {activeActionTab === 'learn' && (
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-100">
                        {response.suggestedActions.learn.conceptTitle}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        Difficulty: {response.primaryNodes[0]?.difficulty || 'Intermediate'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                        Core Takeaway
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {response.suggestedActions.learn.keyTakeaway}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        Deep Dive Mechanism
                      </div>
                      <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/40">
                        {response.suggestedActions.learn.readingSnippet}
                      </p>
                    </div>

                    {response.primaryNodes[0]?.keyPrinciples && (
                      <div className="space-y-1.5 pt-2">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          Key Scientific Principles
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {response.primaryNodes[0].keyPrinciples.map((principle, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CONNECT */}
                {activeActionTab === 'connect' && (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-300">
                      Explore interconnected nodes in the environmental knowledge graph linked to <span className="font-semibold text-emerald-300">{response.primaryNodes[0]?.title}</span>:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {response.suggestedActions.connect.relatedNodes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-xs uppercase font-mono text-emerald-400">
                              {item.relation.replace('_', ' ')}
                            </div>
                            <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onNavigateToConcept?.(item.id);
                              handleAsk(`Explain ${item.title} and its relationship to ${response.primaryNodes[0]?.title}`);
                            }}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors"
                            title="Query related concept"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PRACTICE */}
                {activeActionTab === 'practice' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                        {response.suggestedActions.practice.targetExamOrStandard || 'APES / PE Exam Practice'}
                      </span>
                      {practiceSubmitted && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          practiceSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {practiceSuccess ? '✓ Correct Answer (+5 XP)' : '✗ Incorrect Answer'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-slate-100 leading-relaxed">
                      {response.suggestedActions.practice.question}
                    </p>

                    <div className="space-y-2">
                      {response.suggestedActions.practice.options.map((opt, i) => {
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                        if (selectedPracticeOption === i && !practiceSubmitted) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                        }
                        if (practiceSubmitted) {
                          if (i === response.suggestedActions.practice.correctIndex) {
                            btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                          } else if (selectedPracticeOption === i) {
                            btnStyle = 'bg-red-950/50 border-red-500 text-red-200';
                          }
                        }

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={practiceSubmitted}
                            onClick={() => setSelectedPracticeOption(i)}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!practiceSubmitted ? (
                      <button
                        type="button"
                        disabled={selectedPracticeOption === null}
                        onClick={handlePracticeSubmit}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                        id="btn-check-answer"
                      >
                        Submit & Validate Answer
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 font-semibold uppercase">Explanation & Solution:</div>
                        <p className="text-slate-200 leading-relaxed">
                          {response.suggestedActions.practice.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SIMULATE */}
                {activeActionTab === 'simulate' && (
                  <div className="space-y-4">
                    <EnvironmentalSimulator 
                      modelType={response.primaryNodes[0]?.simulationModel || 'do_bod'}
                      onSimulateAction={handleSimulateLog}
                    />
                  </div>
                )}

                {/* 5. ACT */}
                {activeActionTab === 'act' && (
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                        {response.suggestedActions.act.title}
                      </div>
                      <p className="text-slate-100 font-medium">
                        {response.suggestedActions.act.recommendation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                        <div className="font-semibold text-slate-300">Field Monitoring Protocol:</div>
                        <p className="text-slate-400 leading-relaxed">
                          {response.suggestedActions.act.fieldAction}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                        <div className="font-semibold text-slate-300">Policy & Regulatory Impact:</div>
                        <p className="text-slate-400 leading-relaxed">
                          {response.suggestedActions.act.policyImpact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Sidebar: Curated External Sources & Primary Node Metadata (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Node Badge Card */}
            {response.primaryNodes[0] && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
                    Primary Knowledge Node
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {response.primaryNodes[0].category.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {response.primaryNodes[0].title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {response.primaryNodes[0].summary}
                </p>

                {response.primaryNodes[0].careerRelevance && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-semibold block mb-0.5">Career Application:</span>
                    <span className="text-slate-300">{response.primaryNodes[0].careerRelevance}</span>
                  </div>
                )}
              </div>
            )}

            {/* Matched Curated External Sources */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Curated Sources ({response.matchedResources.length})</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Verified Citations</span>
              </div>

              <div className="space-y-3">
                {response.matchedResources.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2">
                    No explicit external source mapping required for this foundational query.
                  </div>
                ) : (
                  response.matchedResources.map((res, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {res.organization}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {res.reliabilityTier}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200">
                        {res.title}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {res.summary}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] border-t border-slate-900">
                        <span className="text-slate-500 truncate max-w-[170px]">{res.license}</span>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
