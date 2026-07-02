# Genre-Übersicht für MoodMatch Mapping

Diese Datei sammelt die Genres/Kategorien, die jede API tatsächlich liefert.
Ziel: Grundlage für die spätere Zuordnung Genre → Mood (Plutchik-Emotion).

---

## TMDB (Film & Serie)

TMDB hat eine **feste, offizielle Genre-Liste** mit Movie- und TV-spezifischen Varianten.

### Movie Genres
- Action
- Adventure
- Animation
- Comedy
- Crime
- Documentary
- Drama
- Family
- Fantasy
- History
- Horror
- Music
- Mystery
- Romance
- Science Fiction
- TV Movie
- Thriller
- War
- Western

### TV/Series Genres
- Action & Adventure
- Animation
- Comedy
- Crime
- Documentary
- Drama
- Family
- Kids
- Mystery
- News
- Reality
- Sci-Fi & Fantasy
- Soap
- Talk
- War & Politics
- Western

Hinweis: Movie- und TV-Genre-Listen unterscheiden sich teilweise (TV hat z.B.
"Kids", "Soap", "Talk" statt einzelner Genres wie Horror oder Action separat).

---

## RAWG (Games)

RAWG hat ebenfalls eine feste Genre-Liste (etwas kleiner, breiter gefasst):

- Action
- RPG (Role-Playing Games)
- Casual
- Arcade
- Racing
- Family
- Educational
- Indie
- Strategy
- Simulation
- Platformer
- Sports
- Board Games
- Adventure
- Shooter
- Puzzle
- Massively Multiplayer
- Fighting
- Card

---

## Jikan / MyAnimeList (Anime & Manga)

MAL trennt in drei Ebenen, die jeweils als eigenes Feld in der API-Response stehen:

### Genres (Hauptkategorien)
Action, Adventure, Avant Garde, Award Winning, Boys Love, Comedy, Drama,
Fantasy, Girls Love, Gourmet, Horror, Mystery, Romance, Sci-Fi, Slice of Life,
Sports, Supernatural, Suspense

### Themes (zusätzliche, spezifischere Tags)
Beispiele: Psychological, Isekai, Mecha, Military, Music, School,
Historical, Mythology, Time Travel, Survival, Vampire, Workplace, u.v.m.
(MAL pflegt hier eine recht lange, wachsende Liste)

### Demographics (Zielgruppe, nicht direkt emotional, aber relevant für Ton)
Shounen, Shoujo, Seinen, Josei, Kids

Hinweis: Du bekommst in deiner `jikan.js` aktuell nur `genres` zurück (siehe
`getAnimeDetails`/`getMangaDetails`). Für ein präziseres Mood-Mapping könnte es
sich lohnen, später auch `themes` mit auszulesen, da viele Moods (z.B. Tension,
Awe) eher mit Themes als mit den groben Genres übereinstimmen.

---

## Last.fm (Musik)

**Wichtig: Last.fm hat kein festes Genre-System.** Es gibt nur freie,
nutzergenerierte Tags (`toptags`), die alles Mögliche sein können – echte
Genres ("indie pop", "synth-pop"), aber auch Nicht-Genre-Tags ("female
vocalists", "seen live", "favorite").

Empfehlung: Eine eigene, kuratierte Whitelist von akzeptierten Musik-Genres
pflegen (ähnlich wie es spezialisierte Tools für Last.fm-Daten tun), statt
alle Tags ungefiltert zu verwenden. Beispiel-Whitelist (gängige Genres):

rock, indie, pop, hip-hop, rap, r&b, soul, funk, jazz, blues, metal,
hardcore, alternative, grunge, punk, folk, country, reggae, latin, k-pop,
j-pop, electronic, house, techno, drum-and-bass, dubstep, trance, ambient,
classical, soundtrack

---

## Open Library (Bücher)

Open Library hat kein festes Genre-Feld, sondern `subjects` – ebenfalls eine
freie, oft unstrukturierte Liste (siehe deine `getBookDetails` Funktion).
Beispiele aus echten Responses: "Fiction", "Science fiction", "Fantasy
fiction", "American literature", "Ecology" — gemischt mit sehr spezifischen,
unbrauchbaren Einträgen wie "nyt:bestseller=2021-11-07".

Empfehlung: Ähnlich wie bei Last.fm eine Whitelist von relevanten,
generischen Subject-Begriffen pflegen (Fiction, Fantasy, Science Fiction,
Romance, Mystery, Horror, Biography, History, Poetry, etc.), alles andere
ignorieren.

---

## Nächste Schritte (zum Nachdenken, kein Code)

1. Für jede der 8 Moods (Awe, Tension, Rage, Longing, Melancholy, Curiosity,
   Comfort, Joy) eine Liste passender Genres aus den Listen oben zusammenstellen.
2. Überlegen: volle Genre-Liste pro Mood, oder lieber 3-5 "Kern-Genres" pro
   Mood, um Überschneidungen zu vermeiden?
3. Dein Scoring-Idee (Full Match vs. Teil-Match) festhalten: z.B. "Score = Anzahl
   übereinstimmender Genres zwischen Film-Genres und Mood-Genre-Liste".
4. Überlegen, ob Mehrfachzuordnung erlaubt ist (ein Genre wie "Horror" könnte
   sowohl zu Tension als auch zu Rage passen) oder ob jedes Genre nur einer
   Emotion zugeordnet wird.
