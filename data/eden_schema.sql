-- EDEN SQLite Schema Definition (data/eden_v5.db)
-- Environmental Knowledge Graph, Resource Routing & Adaptive Learning Engine

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    formula_metric TEXT,
    difficulty TEXT DEFAULT 'Intermediate',
    simulation_model TEXT,
    exam_relevance TEXT,
    career_relevance TEXT
);

CREATE TABLE IF NOT EXISTS knowledge_edges (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation TEXT NOT NULL,
    weight REAL DEFAULT 1.0,
    FOREIGN KEY (source_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    reliability_tier TEXT NOT NULL,
    url TEXT NOT NULL,
    license TEXT NOT NULL,
    summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resource_routing (
    concept_id TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    PRIMARY KEY (concept_id, resource_id),
    FOREIGN KEY (concept_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 50,
    level TEXT DEFAULT 'Developing',
    events_count INTEGER DEFAULT 0,
    last_practiced TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query TEXT NOT NULL,
    intent TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    score_delta INTEGER DEFAULT 2,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    category TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON knowledge_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON knowledge_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_routing_concept ON resource_routing(concept_id);
CREATE INDEX IF NOT EXISTS idx_events_user ON learning_events(user_id);
