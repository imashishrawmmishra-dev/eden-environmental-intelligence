export type IntentType = 'learning' | 'policy' | 'exam' | 'lab' | 'research' | 'career';

export type ConceptCategory = 
  | 'atmosphere'
  | 'hydrosphere'
  | 'biosphere'
  | 'pollution_indicators'
  | 'environmental_policy'
  | 'careers'
  | 'exams';

export type EdgeRelation = 
  | 'contains'
  | 'interacts_with'
  | 'regulated_by'
  | 'exam_relevance'
  | 'mitigates'
  | 'measured_by'
  | 'leads_to'
  | 'career_pathway';

export interface KnowledgeNode {
  id: string;
  title: string;
  category: ConceptCategory;
  summary: string;
  deepDive: string;
  formulaOrMetric?: string;
  keyPrinciples: string[];
  examRelevance?: string;
  careerRelevance?: string;
  practicalAction?: string;
  simulationModel?: 'do_bod' | 'carbon_budget' | 'species_area';
  resourceIds: string[];
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  description: string;
  strength?: number;
}

export interface CuratedResource {
  id: string;
  title: string;
  organization: 'IPCC' | 'WMO' | 'UNEP' | 'NOAA' | 'EPA' | 'IUCN' | 'Ramsar' | 'UNFCCC';
  type: 'Assessment Report' | 'Technical Standard' | 'Observation Bulletin' | 'Legal Framework' | 'Database';
  url: string;
  license: string;
  summary: string;
  conceptIds: string[];
  peerReviewed: boolean;
  reliabilityTier: 'Tier-1 Authoritative' | 'Government Standard' | 'Treaty Document';
}

export interface SuggestedActions {
  learn: {
    conceptId: string;
    conceptTitle: string;
    keyTakeaway: string;
    readingSnippet: string;
  };
  connect: {
    relatedNodes: { id: string; title: string; relation: string }[];
  };
  practice: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    targetExamOrStandard?: string;
  };
  simulate: {
    modelType: 'do_bod' | 'carbon_budget' | 'species_area';
    title: string;
    description: string;
  };
  act: {
    title: string;
    recommendation: string;
    fieldAction: string;
    policyImpact: string;
  };
}

export interface AskResponse {
  intent: IntentType;
  intentConfidence: number;
  answer: string;
  mode: 'offline_knowledge_graph' | 'live_ai_grounded';
  fallbackReason?: string;
  primaryNodes: KnowledgeNode[];
  connectedEdges: KnowledgeEdge[];
  matchedResources: CuratedResource[];
  suggestedActions: SuggestedActions;
  timestamp: string;
  competencyUpdated?: {
    competencyId: string;
    competencyName: string;
    previousScore: number;
    newScore: number;
  };
}

export interface LearnerCompetency {
  id: string;
  name: string;
  category: ConceptCategory;
  score: number; // 0 - 100
  level: 'Novice' | 'Developing' | 'Proficient' | 'Master';
  lastPracticed: string;
  eventsCount: number;
}

export interface LearningEvent {
  id: string;
  timestamp: string;
  intent: IntentType;
  query: string;
  conceptId: string;
  conceptTitle: string;
  actionTaken: 'asked' | 'practiced' | 'simulated' | 'source_reviewed';
  scoreDelta?: number;
}

export interface LearnerRecommendation {
  id: string;
  title: string;
  category: ConceptCategory;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  targetNodeId: string;
}

export interface PlatformScaffoldingFile {
  id: string;
  title: string;
  platform: 'web' | 'desktop' | 'android' | 'ios' | 'release_layer';
  filePath: string;
  language: 'html' | 'python' | 'bash' | 'kotlin' | 'swift' | 'markdown' | 'dockerfile' | 'ini' | 'json';
  description: string;
  code: string;
}

export interface LaunchGateItem {
  id: string;
  category: 'Legal & Entity' | 'Data & Licensing' | 'Child Safety & Privacy' | 'App Store Compliance' | 'Security & Infrastructure';
  title: string;
  description: string;
  status: 'passed' | 'pending' | 'in_review';
  requirementDoc: string;
}
