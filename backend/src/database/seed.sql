-- Seed data for Sistema de Supervisión
-- RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ

-- Clear existing data (careful in production!)
TRUNCATE TABLE activity_logs, evidence_files, event_participants, evidences, events, users RESTART IDENTITY CASCADE;

-- Insert sample users
-- Password for all users: "password123" (hashed with bcrypt)
-- Hash: $2b$10$YourHashHere (you'll need to generate real hashes)
INSERT INTO users (email, password, full_name, role, avatar_url, is_active) VALUES
('admin@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Admin User', 'admin', 'https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff', true),
('supervisor@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'María González', 'supervisor', 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=667eea&color=fff', true),
('carlos.rodriguez@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Dr. Carlos Rodríguez', 'instructor', 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=667eea&color=fff', true),
('ana.martinez@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Mg. Ana Martínez', 'instructor', 'https://ui-avatars.com/api/?name=Ana+Martinez&background=667eea&color=fff', true),
('roberto.silva@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Ing. Roberto Silva', 'instructor', 'https://ui-avatars.com/api/?name=Roberto+Silva&background=667eea&color=fff', true),
('luis.fernandez@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Dr. Luis Fernández', 'instructor', 'https://ui-avatars.com/api/?name=Luis+Fernandez&background=667eea&color=fff', true),
('viewer@supervision.com', '$2b$10$rQZ9Y7wJ8vJ8Y7wJ8vJ8Y7', 'Usuario Viewer', 'viewer', 'https://ui-avatars.com/api/?name=User+Viewer&background=667eea&color=fff', true);

-- Insert sample events
INSERT INTO events (title, description, type, status, start_date, end_date, start_time, end_time, location, instructor_id, max_participants, current_participants, color, created_by) VALUES
(
    'Capacitación Tecnológica Avanzada',
    'Capacitación enfocada en nuevas tecnologías y metodologías de desarrollo.',
    'capacitacion',
    'en_curso',
    '2025-11-08',
    '2025-11-08',
    '14:30:00',
    '18:00:00',
    'Sala Principal',
    3,
    50,
    45,
    'blue',
    1
),
(
    'Workshop Metodológico',
    'Taller práctico sobre metodologías ágiles y gestión de proyectos.',
    'workshop',
    'completado',
    '2025-11-08',
    '2025-11-08',
    '10:00:00',
    '13:00:00',
    'Sala A',
    2,
    35,
    32,
    'purple',
    1
),
(
    'Seminario de Evaluación',
    'Seminario sobre técnicas y herramientas de evaluación educativa.',
    'seminario',
    'completado',
    '2025-11-07',
    '2025-11-07',
    '16:00:00',
    '19:00:00',
    'Auditorio',
    4,
    30,
    28,
    'green',
    1
),
(
    'Taller Práctico de Innovación',
    'Taller hands-on sobre innovación y creatividad aplicada.',
    'taller',
    'programado',
    '2025-11-15',
    '2025-11-15',
    '09:00:00',
    '12:00:00',
    'Laboratorio 1',
    5,
    25,
    20,
    'orange',
    1
),
(
    'Conferencia Magistral',
    'Conferencia sobre tendencias futuras en educación y tecnología.',
    'conferencia',
    'completado',
    '2025-11-06',
    '2025-11-06',
    '15:00:00',
    '17:00:00',
    'Auditorio Principal',
    6,
    100,
    89,
    'indigo',
    1
),
(
    'Webinar Internacional',
    'Webinar internacional sobre mejores prácticas en educación digital.',
    'webinar',
    'programado',
    '2025-11-20',
    '2025-11-20',
    '18:00:00',
    '20:00:00',
    'Virtual',
    6,
    200,
    0,
    'pink',
    1
);

-- No sample evidences - users will create their own evidences

-- Insert sample event participants
INSERT INTO event_participants (event_id, user_id, attendance_status, attended_at) VALUES
(1, 3, 'attended', '2025-11-08 14:30:00'),
(1, 4, 'attended', '2025-11-08 14:32:00'),
(1, 5, 'attended', '2025-11-08 14:35:00'),
(2, 3, 'attended', '2025-11-08 10:00:00'),
(2, 4, 'attended', '2025-11-08 10:05:00'),
(3, 4, 'attended', '2025-11-07 16:00:00'),
(3, 5, 'attended', '2025-11-07 16:02:00');

-- Insert sample activity logs (only for events, no evidences)
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES
(3, 'JOIN', 'event', 1, 'Instructor se unió al evento: Capacitación Tecnológica Avanzada'),
(1, 'CREATE', 'event', 1, 'Nuevo evento creado: Capacitación Tecnológica Avanzada'),
(1, 'CREATE', 'event', 2, 'Nuevo evento creado: Workshop Metodológico'),
(2, 'COMPLETE', 'event', 2, 'Evento completado: Workshop Metodológico');

-- Verify data
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Events created:', COUNT(*) FROM events
UNION ALL
SELECT 'Participants registered:', COUNT(*) FROM event_participants
UNION ALL
SELECT 'Activity logs created:', COUNT(*) FROM activity_logs;
