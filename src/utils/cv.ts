// Auto-détection des CV : on scanne src/assets/cv/*.pdf et on choisit le bon
// fichier selon la langue en cherchant "fr" ou "en"/"eng" dans le nom.
// Peu importe le reste du nom (ex: "mon-cv-eng.pdf" → anglais).

const cvFiles = import.meta.glob('../assets/cv/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const entries = Object.entries(cvFiles).map(([path, url]) => {
  const name = path.split('/').pop()?.toLowerCase() ?? '';
  return { name, url };
});

// On teste l'anglais en premier ("eng" contient "en" mais pas "fr")
const findByToken = (tokens: string[]) =>
  entries.find(({ name }) =>
    tokens.some((t) => new RegExp(`(^|[^a-z])${t}([^a-z]|$)`).test(name))
  )?.url;

const enCv = findByToken(['eng', 'en']);
const frCv = findByToken(['fr', 'fra']);

export function getCvUrl(lang: 'fr' | 'en'): string | undefined {
  return lang === 'fr' ? frCv ?? enCv : enCv ?? frCv;
}
