-- Create streamers table
CREATE TABLE IF NOT EXISTS streamers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    phone_id VARCHAR(255) NOT NULL UNIQUE,
    points INTEGER DEFAULT 0,
    total_stream_time INTEGER DEFAULT 0,
    is_streaming BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_stream_at TIMESTAMP
);

-- Create streams table
CREATE TABLE IF NOT EXISTS streams (
    id SERIAL PRIMARY KEY,
    streamer_id INTEGER REFERENCES streamers(id),
    title VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration INTEGER DEFAULT 0,
    viewers_count INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active'
);

-- Create viewers table
CREATE TABLE IF NOT EXISTS viewers (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER REFERENCES streams(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    watch_duration INTEGER DEFAULT 0
);

-- Create points_history table
CREATE TABLE IF NOT EXISTS points_history (
    id SERIAL PRIMARY KEY,
    streamer_id INTEGER REFERENCES streamers(id),
    points INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_streamers_points ON streamers(points DESC);
CREATE INDEX IF NOT EXISTS idx_streams_streamer ON streams(streamer_id);
CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_viewers_stream ON viewers(stream_id);
