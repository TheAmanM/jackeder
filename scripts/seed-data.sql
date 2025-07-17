-- Insert sample users
INSERT INTO users (username, email) VALUES
    ('Alex', 'alex@example.com'),
    ('Jordan', 'jordan@example.com'),
    ('Sam', 'sam@example.com'),
    ('Casey', 'casey@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample gym statuses for the past week
WITH user_ids AS (
    SELECT id, username FROM users
),
date_series AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '7 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date as date
)
INSERT INTO gym_statuses (user_id, date, attended)
SELECT 
    u.id,
    d.date,
    CASE 
        WHEN random() > 0.3 THEN true 
        ELSE false 
    END as attended
FROM user_ids u
CROSS JOIN date_series d
ON CONFLICT (user_id, date) DO NOTHING;
