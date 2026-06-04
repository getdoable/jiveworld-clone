// Deterministic content for the Jiveworld clone.
// Nothing here is generated at runtime — the crawler must see identical content
// on every load.

// Shared soundbite + game lists used on every story detail page (per spec).
export const SOUNDBITES = [
  'Érase una vez una erre',
  'Por ahí está la casa',
  'Teorías del tiempo',
  'El esquema de la ciudad',
  'Congelando el tiempo',
  'Conversando con la sobrina',
  'Como en los libros',
];

export const GAMES = ['Abrapalabra', 'Word Jive', 'Amigos'];

// Each story has 4 chapters with a duration and a status (Done / In progress).
function chapters(c1, c2, c3, c4) {
  return [
    { n: 1, title: c1.title, duration: c1.duration, status: c1.status },
    { n: 2, title: c2.title, duration: c2.duration, status: c2.status },
    { n: 3, title: c3.title, duration: c3.duration, status: c3.status },
    { n: 4, title: c4.title, duration: c4.duration, status: c4.status },
  ];
}

export const STORIES = [
  {
    slug: 'perdido-en-san-jose',
    title: 'Perdido en San José',
    author: 'Radio Ambulante',
    duration: '15m',
    country: 'Costa Rica',
    tags: ['Costa Rica', 'Urbanism', 'Family'],
    blurb: 'A wrong turn in the capital turns into the longest night of Daniel’s life.',
    description:
      'Daniel arrives in San José for the first time and a simple errand spirals into a disorienting journey across the city. A story about getting lost — and found.',
    color: '#c98b6b',
    primary: 'inProgress',
    progressLabel: 'In progress',
    chapters: chapters(
      { title: 'Una ciudad nueva', duration: '4m', status: 'Done' },
      { title: 'El giro equivocado', duration: '4m', status: 'In progress' },
      { title: 'La larga noche', duration: '4m', status: 'In progress' },
      { title: 'Amanecer', duration: '3m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: 'ciudad',
  },
  {
    slug: 'boom-colapso',
    title: 'Boom/Colapso',
    author: 'Radio Ambulante',
    duration: '22m',
    country: 'Venezuela',
    tags: ['Venezuela', 'Economy', 'Migration'],
    blurb: 'The story of Venezuela, as told through the migration of one family.',
    description:
      'The story of Venezuela, as told through the migration of one family — from the oil boom years to the collapse that scattered them across a continent.',
    color: '#e0b483',
    primary: 'completed',
    progressLabel: 'Completed',
    chapters: chapters(
      { title: 'El boom', duration: '6m', status: 'Done' },
      { title: 'Los buenos años', duration: '5m', status: 'Done' },
      { title: 'El colapso', duration: '6m', status: 'Done' },
      { title: 'La diáspora', duration: '5m', status: 'Done' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'luna-llena',
    title: 'Luna llena sobre Chiapas',
    author: 'Radio Ambulante',
    duration: '18m',
    country: 'Mexico',
    tags: ['Mexico', 'Folklore', 'Mystery'],
    blurb: 'A full moon, a blood-curdling howl, and a town that can’t sleep.',
    description:
      'A full moon, a blood-curdling howl, and a town that can’t sleep. In rural Chiapas, an old legend refuses to stay buried.',
    color: '#2b2b2b',
    primary: 'completed',
    progressLabel: 'Completed',
    chapters: chapters(
      { title: 'El aullido', duration: '5m', status: 'Done' },
      { title: 'El pueblo despierto', duration: '4m', status: 'Done' },
      { title: 'La leyenda', duration: '5m', status: 'Done' },
      { title: 'Luna llena', duration: '4m', status: 'Done' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'sentencia',
    title: 'La sentencia',
    author: 'Radio Ambulante',
    duration: '20m',
    country: 'Dominican Republic',
    tags: ['Dominican Republic', 'Politics', 'Identity'],
    blurb: 'Juliana never left her native country. So why is she an immigrant?',
    description:
      'Juliana never left her native country. So why is she an immigrant? A single court ruling strips thousands of their nationality overnight.',
    color: '#b86b4b',
    primary: 'studyLater',
    progressLabel: 'Study later',
    chapters: chapters(
      { title: 'La noticia', duration: '5m', status: 'In progress' },
      { title: 'Sin papeles', duration: '5m', status: 'In progress' },
      { title: 'La lucha', duration: '5m', status: 'In progress' },
      { title: 'La sentencia', duration: '5m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'en-busca-de-las-palabras',
    title: 'En busca de las palabras',
    author: 'Radio Ambulante',
    duration: '19m',
    country: 'Mexico',
    tags: ['Mexico', 'Language', 'Family'],
    blurb: 'Micah is on a quest to recover the words his grandparents spoke.',
    description:
      'Micah is on a quest to recover the words his grandparents spoke — a vanishing indigenous language, and the family memory tangled up in it.',
    color: '#cbb89a',
    primary: 'inProgress',
    progressLabel: 'In progress',
    chapters: chapters(
      { title: 'Presentando a Micah', duration: '5m', status: 'In progress' },
      { title: 'Las palabras perdidas', duration: '5m', status: 'In progress' },
      { title: 'Los abuelos', duration: '5m', status: 'In progress' },
      { title: 'En busca', duration: '4m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'miedo',
    title: 'Miedo',
    author: 'Radio Ambulante',
    duration: '5m',
    country: 'Colombia',
    tags: ['Colombia', 'Education', 'Language'],
    blurb: 'How far will Hernando go to impress his classmates?',
    description:
      'How far will Hernando go to impress his classmates? A short story about studying abroad, fear, and the things we do to belong.',
    color: '#7fd0e6',
    primary: 'inProgress',
    progressLabel: 'In progress',
    chapters: chapters(
      { title: 'Estudiar en el extranjero', duration: '1m', status: 'In progress' },
      { title: 'La clase', duration: '1m', status: 'In progress' },
      { title: 'El miedo', duration: '2m', status: 'In progress' },
      { title: 'Desde el inicio', duration: '1m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'ra-nn',
    title: 'N.N.',
    author: 'Radio Ambulante',
    duration: '24m',
    country: 'Colombia',
    tags: ['Colombia', 'Memory', 'Death'],
    blurb: 'In one Colombian town, the nameless dead are rechristened and revered.',
    description:
      'In one Colombian town, the nameless dead — the “N.N.” — are rechristened, adopted, and revered. A story about grief, ritual, and the names we give to strangers.',
    color: '#e7b9c4',
    primary: 'studyLater',
    progressLabel: 'Study later',
    chapters: chapters(
      { title: 'Los sin nombre', duration: '6m', status: 'In progress' },
      { title: 'El cementerio', duration: '6m', status: 'In progress' },
      { title: 'Adoptar un alma', duration: '6m', status: 'In progress' },
      { title: 'N.N.', duration: '6m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: 'ciudad',
  },
  {
    slug: 'ra-perro-raro',
    title: 'Este perro está raro',
    author: 'Radio Ambulante',
    duration: '14m',
    country: 'Peru',
    tags: ['Peru', 'Environment', 'Family', 'Urbanism', 'Uplifting'],
    blurb: 'Ronald’s new pet isn’t what it seems.',
    description:
      'Ronald Llata buys an injured puppy at the Mercado Central in Lima. After weeks of caring for it, he and his mom start to realize that something about the animal isn’t quite as it should be.',
    color: '#9fc6d6',
    primary: 'inProgress',
    progressLabel: 'In progress',
    chapters: chapters(
      { title: 'Un cachorro herido', duration: '4m', status: 'Done' },
      { title: 'Acontecimientos inesperados', duration: '3m', status: 'In progress' },
      { title: 'El circo mediático', duration: '4m', status: 'In progress' },
      { title: 'Una solución oficial', duration: '3m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: 'ciudad',
  },
  {
    slug: 'el-superheroe',
    title: 'El superhéroe',
    author: 'Radio Ambulante',
    duration: '6m',
    country: 'Argentina',
    tags: ['Argentina', 'Justice', 'Humor'],
    blurb: 'Menganno fights crime (while fighting for his marriage).',
    description:
      'Menganno fights crime (while fighting for his marriage). A masked vigilante patrols the suburbs of Buenos Aires — and his wife has had just about enough.',
    color: '#9aa6e0',
    primary: 'studyLater',
    progressLabel: 'Study later',
    chapters: chapters(
      { title: 'El traje', duration: '2m', status: 'In progress' },
      { title: 'La patrulla', duration: '1m', status: 'In progress' },
      { title: 'En casa', duration: '2m', status: 'In progress' },
      { title: 'El superhéroe', duration: '1m', status: 'In progress' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: null,
  },
  {
    slug: 'ra-no-nos-compete',
    title: 'No nos compete',
    author: 'Radio Ambulante',
    duration: '21m',
    country: 'Mexico',
    tags: ['Mexico', 'Education', 'Safety'],
    blurb: 'Who can guarantee that Mexican schools are safe?',
    description:
      'Who can guarantee that Mexican schools are safe? After an earthquake, parents discover that no one wants to take responsibility for the buildings their children study in.',
    color: '#6b7d5c',
    primary: 'completed',
    progressLabel: 'Completed',
    chapters: chapters(
      { title: 'El temblor', duration: '6m', status: 'Done' },
      { title: 'Las grietas', duration: '5m', status: 'Done' },
      { title: 'Nadie responde', duration: '5m', status: 'Done' },
      { title: 'No nos compete', duration: '5m', status: 'Done' }
    ),
    soundbitesDone: 0,
    gamesDone: 0,
    inCollection: 'ciudad',
  },
];

export const COLLECTIONS = [
  {
    slug: 'ciudad',
    title: 'Códigos urbanos: Unraveling Latin American cities',
    shortTitle: 'Códigos urbanos',
    description:
      'Four stories that read the hidden codes of Latin American cities — their streets, their dead, their stray animals, and the buildings that hold them together.',
    color: '#3aa7d4',
    storySlugs: ['perdido-en-san-jose', 'ra-nn', 'ra-perro-raro', 'ra-no-nos-compete'],
  },
];

// --- Lookup helpers --------------------------------------------------------
export function getStory(slug) {
  return STORIES.find((s) => s.slug === slug) || null;
}

export function getStoriesByPrimary(primary) {
  return STORIES.filter((s) => s.primary === primary);
}

export function getCollection(slug) {
  return COLLECTIONS.find((c) => c.slug === slug) || null;
}

export function getCollectionStories(slug) {
  const c = getCollection(slug);
  if (!c) return [];
  return c.storySlugs.map(getStory).filter(Boolean);
}

// "Related stories" for a detail page: the next two stories in the list
// (deterministic, wrapping around), excluding the story itself.
export function getRelatedStories(slug) {
  const idx = STORIES.findIndex((s) => s.slug === slug);
  if (idx === -1) return STORIES.slice(0, 2);
  const related = [];
  let i = idx + 1;
  while (related.length < 2) {
    related.push(STORIES[i % STORIES.length]);
    i += 1;
  }
  return related;
}

// Home page groupings.
export const HOME_IN_PROGRESS = STORIES.filter((s) => s.primary === 'inProgress').slice(0, 3);
export const HOME_COMPLETED = STORIES.filter((s) => s.primary === 'completed').slice(0, 2);
export const HOME_STUDY_LATER = STORIES.filter((s) => s.primary === 'studyLater').slice(0, 2);
