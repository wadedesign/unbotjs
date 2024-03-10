
CREATE TABLE thread_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Generates a unique UUID for each row
    user_id TEXT NOT NULL, -- Discord User ID as text
    title TEXT NOT NULL, -- Title of the thread
    message_ids TEXT NOT NULL, -- Storing message IDs as a JSON array (text format)
    created_at TIMESTAMPTZ NOT NULL -- Timestamp with timezone, records when the entry was created
);
