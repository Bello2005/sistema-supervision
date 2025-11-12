-- Sistema de Supervisión - Database Schema
-- RES N° 215 DE 2025 - RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ

-- Drop existing tables (be careful in production!)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS evidence_files CASCADE;
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS evidences CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS evidence_type CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'supervisor', 'instructor', 'viewer');
CREATE TYPE event_type AS ENUM ('capacitacion', 'workshop', 'seminario', 'taller', 'conferencia', 'webinar');
CREATE TYPE event_status AS ENUM ('programado', 'en_curso', 'completado', 'cancelado');
CREATE TYPE evidence_type AS ENUM ('foto', 'video', 'documento', 'audio');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type event_type NOT NULL,
    status event_status DEFAULT 'programado',
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    color VARCHAR(50) DEFAULT 'blue',
    is_online BOOLEAN DEFAULT false,
    meeting_url TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Participants table
CREATE TABLE event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    attendance_status VARCHAR(50) DEFAULT 'registered',
    attended_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Evidences table
CREATE TABLE evidences (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    evidence_type evidence_type NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tags TEXT[], -- PostgreSQL array
    metadata JSONB, -- Additional flexible data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evidence Files table (multiple files per evidence)
CREATE TABLE evidence_files (
    id SERIAL PRIMARY KEY,
    evidence_id INTEGER REFERENCES evidences(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT,
    file_size BIGINT, -- in bytes
    mime_type VARCHAR(100),
    thumbnail_url TEXT,
    duration INTEGER, -- for videos/audio in seconds
    width INTEGER, -- for images/videos
    height INTEGER, -- for images/videos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'event', 'evidence', 'user', etc.
    entity_id INTEGER,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_instructor ON events(instructor_id);
CREATE INDEX idx_evidences_event ON evidences(event_id);
CREATE INDEX idx_evidences_type ON evidences(evidence_type);
CREATE INDEX idx_evidences_tags ON evidences USING GIN(tags);
CREATE INDEX idx_evidence_files_evidence ON evidence_files(evidence_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evidences_updated_at BEFORE UPDATE ON evidences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update event participant count
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET current_participants = current_participants + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET current_participants = GREATEST(current_participants - 1, 0)
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for participant count
CREATE TRIGGER update_participant_count AFTER INSERT OR DELETE ON event_participants
    FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Create views for common queries
CREATE OR REPLACE VIEW events_with_instructor AS
SELECT
    e.*,
    u.full_name as instructor_name,
    u.email as instructor_email,
    u.avatar_url as instructor_avatar
FROM events e
LEFT JOIN users u ON e.instructor_id = u.id;

CREATE OR REPLACE VIEW evidences_summary AS
SELECT
    e.*,
    u.full_name as uploaded_by_name,
    ev.title as event_title,
    COUNT(ef.id) as file_count,
    SUM(ef.file_size) as total_size
FROM evidences e
LEFT JOIN users u ON e.uploaded_by = u.id
LEFT JOIN events ev ON e.event_id = ev.id
LEFT JOIN evidence_files ef ON e.id = ef.evidence_id
GROUP BY e.id, u.full_name, ev.title;

-- Comments for documentation
COMMENT ON TABLE users IS 'Sistema de usuarios con roles: admin, supervisor, instructor, viewer';
COMMENT ON TABLE events IS 'Eventos de capacitación, talleres, seminarios, etc.';
COMMENT ON TABLE evidences IS 'Evidencias fotográficas, videos, documentos asociados a eventos';
COMMENT ON TABLE evidence_files IS 'Archivos individuales de cada evidencia';
COMMENT ON TABLE activity_logs IS 'Registro de todas las actividades del sistema';
