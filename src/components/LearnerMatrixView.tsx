import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  Target, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { LearnerCompetency, LearningEvent, LearnerRecommendation } from '../types';

interface Props {
  onStudyConcept: (conceptTitle: string) => void;
}

export const LearnerMatrixView: React.FC<Props> = ({ onStudyConcept }) => {
  const [profile, setProfile] = useState<{
    userId: string;
    overallMastery: number;
    competencies: LearnerCompetency[];
    recommendations: LearnerRecommendation[];
    recentEvents: LearningEvent[];
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/learner/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch learner profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetProfile = async () => {
    setLoading(true);
    try {
      await fetch('/api/v1/learner/reset', { method: 'POST' });
      await fetchProfile();
    } catch (err) {
      console.error('Failed to reset profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Master': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Proficient': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Developing': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="learner-matrix-view">
      
      {/* Top Banner: Overall Mastery Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-950/60">
            {profile?.overallMastery || 72}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
                Active Learner Profile (data/eden_v5.db)
              </span>
              <button 
                onClick={fetchProfile}
                disabled={loading}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleResetProfile}
                disabled={loading}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors px-2 py-0.5 rounded border border-slate-800 hover:border-rose-500/30"
                title="Reset learner progress to baseline"
              >
                Reset
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Environmental Competency Tracking Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Continuous adaptive progress tracking across atmospheric, aquatic, and regulatory domains
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Certification Milestone</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">Advanced Environmental Scholar</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Competency Cards (8 cols) & Dynamic Recommendations (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Competencies (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Competency Domains ({profile?.competencies.length || 6})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-Time SQLite State</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile?.competencies.map(comp => (
              <div
                key={comp.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {comp.name}
                  </h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getLevelColor(comp.level)}`}>
                    {comp.level}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Domain Mastery</span>
                    <span className="text-emerald-400 font-bold">{comp.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{comp.eventsCount} Learning Events</span>
                  <span>Practiced {comp.lastPracticed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations & Gap Closure (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Targeted Recommendations</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-medium">Gap Analysis</span>
          </div>

          <div className="space-y-3">
            {profile?.recommendations.map(rec => (
              <div
                key={rec.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                    rec.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[11px] text-slate-500 capitalize">
                    {rec.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs font-bold text-white">
                  {rec.title}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {rec.reason}
                </p>

                <button
                  type="button"
                  onClick={() => onStudyConcept(rec.targetNodeId || rec.title)}
                  className="w-full mt-1 py-1.5 bg-slate-950 hover:bg-emerald-600 hover:text-white border border-slate-800 text-emerald-400 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Study Concept</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Learning Event Timeline History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Audit Event Log (learning_events table)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Tracks inquiries, quizzes & simulation runs
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto">
          {profile?.recentEvents.map(evt => (
            <div key={evt.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  evt.actionTaken === 'practiced' ? 'bg-amber-400' : evt.actionTaken === 'simulated' ? 'bg-cyan-400' : 'bg-emerald-400'
                }`} />
                <div>
                  <span className="font-semibold text-slate-200">{evt.query}</span>
                  <span className="text-slate-500 ml-2">[{evt.intent}]</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-emerald-400 font-mono font-semibold">+{evt.scoreDelta || 2} pts</span>
                <span className="text-[11px] text-slate-500">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
