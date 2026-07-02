# MoodMatch Genre-Mapping (final geschärft)

Mapping: Awe, Tension, Rage, Longing, Melancholy, Curiosity, Comfort, Joy

finaler_score = (match_score_normalisiert * 0.4) + (rating_normalisiert_auf_10er_skala / 10 * 0.6)

**Idee für später (noch nicht eingebaut):** Genres nach ihrer Reihenfolge in der
API-Antwort unterschiedlich gewichten (erstes Genre zählt mehr als das letzte),
um zu verhindern dass ein "Beifang-Genre" einen Score unverhältnismäßig hochzieht.
Zurückgestellt, weil nicht alle APIs garantiert nach Relevanz sortierte Genre-Listen
liefern — müsste erst geprüft werden, bevor man sich darauf verlässt.

---

## TMDB Movies
rating_normalisiert = vote_average

| Mood | Genres |
|---|---|
| Awe | Fantasy, Adventure, History, Science Fiction *(Thriller entfernt — erzeugt Tension, nicht Ehrfurcht)* |
| Tension | Action, Crime, Drama, History, Horror, Mystery, Thriller, War |
| Rage | Action, Crime, Science Fiction, War, Horror *(Horror ergänzt — intensiver Horror kippt oft in Wut/Adrenalin)* |
| Longing | Adventure, Drama, Family, Fantasy, Romance |
| Melancholy | Drama, Family, History, Horror, Music, Romance, Thriller |
| Curiosity | Drama, Fantasy, History, Mystery, Science Fiction, Thriller |
| Comfort | Comedy, Family, Music, Romance |
| Joy | Adventure, Comedy, Family, Music, Romance, Science Fiction |

Nicht zugeordnet (bewusst, Format-Genres ohne feste Emotion): Animation, Documentary, TV Movie, Western

---

## TMDB Series
rating_normalisiert = vote_average

| Mood | Genres |
|---|---|
| Awe | Action & Adventure, Sci-Fi & Fantasy *(Mystery entfernt, konsistent zu Movies-Logik)* |
| Tension | Action & Adventure, Drama, Mystery, War & Politics, Horror *(Series hat kein eigenes Horror-Genre bei TMDB — falls später doch verfügbar, hier ergänzen)* |
| Rage | Action & Adventure, Sci-Fi & Fantasy, War & Politics, Horror |
| Longing | Drama, Family, Reality, Sci-Fi & Fantasy |
| Melancholy | Drama, Family, Reality |
| Curiosity | Drama, Mystery, News, Sci-Fi & Fantasy, Soap |
| Comfort | Comedy, Drama, Family, Talk *(Reality entfernt — passt eher zu Longing/Melancholy/Joy als zu Geborgenheit)* |
| Joy | Comedy, Family, Kids, Reality |

Nicht zugeordnet: Animation

---

## RAWG (Games)
rating_normalisiert = (rating / 5) * 10

| Mood | Genres |
|---|---|
| Awe | Action, RPG, Simulation, Adventure |
| Tension | Action, Racing, Strategy, Platformer, Sports, Adventure, Shooter |
| Rage | Action, Adventure, Shooter |
| Longing | RPG, Arcade, Family, Educational, Simulation |
| Melancholy | Casual, Family, Indie, Simulation, Puzzle |
| Curiosity | RPG, Adventure, Casual, Arcade, Educational, Indie, Strategy, Simulation, Puzzle |
| Comfort | Casual, Family, Educational, Indie, Board Games, Puzzle, Card *(Strategy entfernt — Echtzeitstrategie erzeugt eher Tension, rundenbasierte eher Curiosity; insgesamt zu ambivalent für Comfort)* |
| Joy | RPG, Arcade, Racing, Family, Indie, Platformer, Sports, Board Games, Card *(Shooter entfernt — nur Ausnahmefälle wie Splatoon sind "Joy", Shooter trägt meist Tension/Rage in sich)* |

Nicht zugeordnet (bewusst, Format-Genre ohne feste Emotion): Massively Multiplayer

---

## Jikan (Anime & Manga)
rating_normalisiert = score

| Mood | Genres/Themes |
|---|---|
| Awe | Adventure, Fantasy, Sci-Fi, Supernatural, Mecha, Historical, Mythology, Time Travel |
| Tension | Action, Adventure, Drama, Horror, Mystery, Military, Historical, Time Travel, Survival, Shounen, Seinen |
| Rage | Action, Sci-Fi, Mecha, Military, Mythology, Shounen, Seinen |
| Longing | Adventure, Avant Garde, Slice of Life, Supernatural, Isekai, School, Mythology, Survival, Seinen, Shoujo, Josei, Boys Love, Girls Love |
| Melancholy | Avant Garde, Drama, Mystery, Romance, Psychological, Historical, Time Travel, Workplace, Shoujo, Josei |
| Curiosity | Adventure, Fantasy, Mystery, Sci-Fi, Supernatural, Isekai, Mecha, Historical, Mythology, Time Travel, Survival, Vampire, Shounen, Shoujo |
| Comfort | Adventure, Comedy, Gourmet, Romance, Slice of Life, School, Historical, Workplace, Shoujo, Josei, Kids |
| Joy | Comedy, Fantasy, Gourmet, Romance, Sci-Fi, Slice of Life, Sports, Isekai, Music, School, Workplace, Shounen, Kids |

Hinweis: Boys Love / Girls Love analog zu Romance bei Longing eingeordnet.

---

## Last.fm (Musik)
listeners_normalisiert = (listeners_dieses_songs / höchste_listeners_in_den_ergebnissen) * 10

Whitelist: rock, indie, pop, hip-hop, rap, r&b, soul, funk, jazz, blues, metal, hardcore, alternative, grunge, punk, folk, country, reggae, latin, k-pop, j-pop, electronic, house, techno, drum-and-bass, dubstep, trance, ambient, classical, soundtrack, industrial, noise, drone, gothic, darkwave, lo-fi, downtempo, shoegaze, dream pop, neoclassical, synthwave, retrowave, psychedelic, ska, world, ethnic, instrumental, chillout

| Mood | Tags |
|---|---|
| Awe | classical, neoclassical, soundtrack, ambient, drone *(pop/j-pop entfernt — Popmusik erzeugt selten epische Ehrfurcht; monumentale, orchestrale Klänge passen besser)* |
| Tension | hip-hop, electronic, techno, drum-and-bass, dubstep, noise, drone, gothic, darkwave, synthwave, retrowave, industrial *(pop, funk, j-pop entfernt — zu weich für Spannung)* |
| Rage | rock, metal, hardcore, grunge, industrial, noise, punk, gothic, darkwave *(funk, pop, j-pop, electronic, techno, dubstep, shoegaze entfernt — Aggression braucht härtere Genres; punk ergänzt)* |
| Longing | r&b, soul, jazz, reggae, latin, trance, soundtrack, lo-fi, dream pop, shoegaze, alternative *(world, chillout entfernt, alternative/shoegaze ergänzt)* |
| Melancholy | jazz, soul, blues, trance, ambient, lo-fi, downtempo, neoclassical, chillout, gothic |
| Curiosity | alternative, folk, country, latin, drum-and-bass, soundtrack, drone, synthwave, retrowave, psychedelic, ska, world, ethnic *(pop, classical, ambient, downtempo entfernt — klare Abgrenzung zu Comfort)* |
| Comfort | r&b, pop, soul, jazz, reggae, country, house, classical, lo-fi, downtempo, neoclassical, instrumental, chillout, j-pop, k-pop *(ambient, latin entfernt, pop/j-pop/k-pop ergänzt — klare Abgrenzung zu Curiosity)* |
| Joy | indie, pop, hip-hop, funk, alternative, k-pop, j-pop, house, dream pop, ska *(world entfernt, da jetzt exklusiv bei Curiosity)* |

Hinweis: Comfort/Curiosity-Überschneidung war das Hauptproblem der ersten Version — jetzt klar getrennt: Curiosity = suchend/atmosphärisch/fremd, Comfort = warm/entspannend/vertraut.

---

## Open Library (Bücher)
rating_normalisiert = average_rating (meist bereits 0–5, ggf. *2 für 0–10 Skala)

Whitelist: Fiction, Science Fiction, Fantasy, Horror, Mystery, Thriller, Suspense, Romance, Drama, Comedy, Humorous stories, Historical fiction, Adventure stories, Graphic novels, Poetry, Biography, History, Philosophy, Psychology, True crime, Mythology, Folklore, Dystopias, War stories, Fairy tales, Short stories

| Mood | Subjects |
|---|---|
| Awe | Science Fiction, Fantasy, Adventure stories, Mythology, Dystopias, Philosophy, History *(Philosophy/History ergänzt — intellektuelles Staunen über Universum/menschliches Denken)* |
| Tension | Fiction, Science Fiction, Horror, Thriller, Suspense, Drama, Adventure stories, True crime, Dystopias, War stories |
| Rage | Thriller, Suspense, Dystopias, War stories |
| Longing | Fiction, Fantasy, Romance, Historical fiction, Fairy tales *(Philosophy entfernt — passt eher zu Awe/Curiosity)* |
| Melancholy | Fiction, Romance, Drama, Poetry, Philosophy, Dystopias, History *(History ergänzt)* |
| Curiosity | Science Fiction, Fantasy, Drama, Historical fiction, Biography, History, Philosophy, True crime, Mythology, Folklore, Fairy tales |
| Comfort | Romance, Poetry, Folklore, Short stories, Comedy, Humorous stories *(Philosophy, History, Biography entfernt — ernste/schwere Themen spenden keinen Trost)* |
| Joy | Romance, Comedy, Humorous stories, Adventure stories, Fairy tales, Short stories, Graphic novels |

---

## Track vs. Album / Buch vs. Hörbuch

Die Genre-Zuordnung bleibt für beide Formate innerhalb eines Medientyps identisch
(z.B. Album und Track nutzen dieselbe Last.fm-Tabelle oben). Die Story/Tonalität
ändert sich nicht durch das Format — nur die Rohdaten-Granularität unterscheidet
sich leicht (Tracks oft spezifischer getaggt als Alben), das deckt die Whitelist
bereits ab, ohne dass eine separate Tabelle nötig ist.
