CREATE TYPE mood_enum AS ENUM('awe', 'tension', 'rage','longing', 'melancholy', 'curiosity', 'comfort', 'joy');

CREATE TYPE media_type_enum AS ENUM('movie','series','game','anime', 'manga','album', 'track','book');

CREATE TYPE status_enum AS ENUM('completed', 'in_progress', 'dropped', 'watchlist');

CREATE TABLE users( 
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(155) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE media(
    id SERIAL PRIMARY KEY,
    external_id INTEGER NOT NULL,
    media_type media_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    UNIQUE (external_id, media_type)
);

CREATE TABLE user_media_list(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    media_id INTEGER REFERENCES media(id),
    status status_enum,
    rating SMALLINT CHECK (rating >=1 AND rating <=10),
    progress INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_mood_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mood mood_enum,
    selected_at TIMESTAMP DEFAULT NOW()
);
