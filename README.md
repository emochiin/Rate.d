# rate.d 🎬✨🎮📚🎵

> **"I think that is what film and art and music do; they can work as a map of sorts for your feelings." ~ Bruce Springsteen**

rate.d is an all-in-one media tracking platform for movies, series, anime, games, books and music — with a mood-based recommendation engine inspired by Plutchik's Wheel of Emotions.

---

## ✨ Features

- 🎬 **Universal Tracking** | Rate and track movies, series, anime, games, books & music in one place
- 🎭 **MoodMatch** | Get recommendations based on how you feel right now, powered by Plutchik's 8 core emotions
- ⭐ **Personal Ratings** | 1–10 star system with short reviews
- 📊 **Taste Profile** | See your real stats: which genres you actually consume most
- 👥 **Friends** | Compare ratings and discover what your friends are watching or playing
- 🔐 **Secure Auth** | JWT-based authentication

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Bootstrap |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT |
| APIs | TMDB · Jikan · RAWG · Open Library · Last.fm |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/rate.d.git
cd rate.d

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file in `/backend`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/rated
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_key
RAWG_API_KEY=your_rawg_key
LASTFM_API_KEY=your_lastfm_key
```

### Run

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from root)
npm run dev
```

---

## 🎭 MoodMatch — How It Works

rate.d uses **Plutchik's Wheel of Emotions** to tag every piece of media with one or more core emotions:

| Mood | Emotion Theory | Example |
|---|---|---|
| Awe | Fear + Surprise | Interstellar, Attack on Titan |
| Melancholy | Sadness + Beauty | Your Lie in April, The Last of Us |
| Tension | Anticipation + Fear | Breaking Bad, Thriller Games |
| Comfort | Trust + Joy | Studio Ghibli, Cozy Games |
| Rage / Catharsis | Anger release | God of War, Action Anime |
| Curiosity | Anticipation + Surprise | Sci-Fi, Mystery |
| Longing | Love + Sadness | Romance, Slice of Life |
| Joy | Pure Joy | Comedy, Feel-good Films |

When you pick a mood, rate.d finds unrated media tagged with that emotion — sorted by community ratings.

---

## 📸 Screenshots

> Coming soon

---

## 📄 License

Emirkan Aygün © 2026 — Built as part of the Web Programming module @ Medieninformatik
