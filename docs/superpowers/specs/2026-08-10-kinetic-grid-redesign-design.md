# KineticGrid — Refonte du background interactif

Date : 2026-08-10
Fichier concerné : `src/components/background/InteractiveBackground.tsx`

## Contexte

Le background global du portfolio est une grille de points reliés par des lignes,
qui réagit à la souris (attraction des points, surbrillance de proximité). Le
composant est rendu en `position: fixed`, `pointer-events: none`, `zIndex: 0`,
sous tout le contenu (`App.tsx` → `<KineticGrid />`).

Trois problèmes / demandes :

1. **Vibration** : quand la souris s'arrête, certains points oscillent
   rapidement autour de leur position d'origine (ressort sans état de repos).
2. **Lourdeur** : la boucle d'animation parcourt tous les points 3 fois par
   frame et calcule une racine carrée par point même loin de la souris.
3. **Nouvelle fonctionnalité clic** : au clic, créer une onde qui pousse
   physiquement les points, afficher un texte cyber/GRC (ACCESS GRANTED /
   DENIED, COMPLIANT, RISK DETECTED…) coloré selon le message, et teinter
   temporairement la grille autour du clic avant retour à l'état initial.

## Objectifs

- Supprimer la vibration résiduelle des points au repos.
- Réduire le coût par frame de la boucle d'animation.
- Ajouter au clic : onde physique + texte coloré + teinte locale temporaire.
- Ne pas casser l'appel existant `<KineticGrid />` (toutes les nouvelles props
  ont des valeurs par défaut).
- Le composant reste non bloquant (`pointer-events: none`) : les clics sont
  captés via `window.addEventListener("click", …)`, comme `mousemove`.

## 1. Correction de la vibration (sleep threshold)

Dans la boucle physique, après mise à jour de `vx/vy/x/y` pour un point :

- Si le point n'est **pas** sous influence (souris hors rayon ET aucune onde
  active à proximité) **et** que `|vx|`, `|vy|`, `|x-hx|`, `|y-hy|` sont tous
  inférieurs à un seuil `SLEEP = 0.01`, alors on force :
  `x = hx; y = hy; vx = 0; vy = 0`.
- Le point « dort » → plus d'oscillation. Bénéfice perf : un point endormi et
  hors influence peut sauter le reste de son calcul physique.

Le facteur de friction reste `0.82` ; le seuil est ce qui élimine le tremblement.

## 2. Allègement / performance

- **Fusion des boucles** : une seule passe sur `cols`/`dots` par frame pour
  (a) physique, (b) tracé des lignes vers voisins droite/bas, (c) tracé des
  points. On calcule `prox` une seule fois par point et on le réutilise.
- **Distances au carré** : le test de proximité souris utilise `distSq < R*R`
  au lieu de `Math.sqrt(...) < R`. La vraie distance (`sqrt`) n'est calculée que
  lorsqu'on a besoin de la direction normalisée (attraction / onde).
- **Cap du `devicePixelRatio` à 2** : `dpr = min(window.devicePixelRatio || 1, 2)`
  pour éviter un canvas plein écran en dpr 3 sur mobiles hi-DPI.
- **`prefers-reduced-motion`** : si activé, on dessine une grille statique une
  seule fois (pas de `requestAnimationFrame`), et le clic n'anime rien. Bonus
  accessibilité + perf.
- Le `spacing` par défaut reste **59** (pas de changement d'apparence de la
  grille).

## 3. Onde de clic

Nouveau tableau `ripples: { x, y, t0, tone }[]` (au niveau du `useEffect`).

Au `click` (écouté sur `window`) :
- Position convertie en coordonnées canvas (via `getBoundingClientRect`).
- On tire un message (voir §4) → `tone` (`"ok"` | `"bad"`).
- On empile `{ x, y, t0: performance.now(), tone, msgIndex }` + un label
  d'affichage (voir §5). On limite la taille du tableau (ex. 6 ondes max) et on
  purge les ondes dont l'âge dépasse la durée de vie.

Paramètres d'onde :
- `WAVE_LIFE = 900` ms (durée de vie).
- `WAVE_SPEED` : rayon front = `age * vitesse` (calibré pour traverser ~600px
  sur la durée de vie).
- **Impulsion physique** : pour chaque point, si sa distance au centre de l'onde
  est proche du rayon-front courant (dans une bande d'épaisseur `WAVE_BAND`), on
  ajoute une accélération radiale vers l'extérieur, pondérée par
  `(1 - age/WAVE_LIFE)` (décroît avec l'âge). Le point est alors « sous
  influence » → il ne s'endort pas pendant l'onde.

## 4. Messages et couleurs

Tableau typé (constante module) :

```ts
const MESSAGES: { text: string; tone: "ok" | "bad" }[] = [
  { text: "ACCESS GRANTED", tone: "ok" },
  { text: "ACCESS DENIED", tone: "bad" },
  { text: "CONNECTION ESTABLISHED", tone: "ok" },
  { text: "COMPLIANT", tone: "ok" },
  { text: "AUDIT PASSED", tone: "ok" },
  { text: "POLICY ENFORCED", tone: "ok" },
  { text: "RISK DETECTED", tone: "bad" },
  { text: "ACCESS REVOKED", tone: "bad" },
  { text: "UNAUTHORIZED", tone: "bad" },
];
```

Sélection : `Math.random()` (code navigateur classique, autorisé ici) pour
choisir un index à chaque clic.

Couleurs par `tone` (props avec défauts) :
- `okColor = "#22c55e"` (vert)
- `badColor = "#ef4444"` (rouge)

La couleur du `tone` pilote : la police du texte, les cercles d'onde, et la
teinte locale de la grille (§5).

## 5. Effet visuel + texte + teinte locale

Dessinés **après** la grille, dans la même frame, pour chaque onde active :

- **Cercles d'onde** : 1 à 2 arcs au rayon-front, `strokeStyle` = couleur du
  tone, `globalAlpha` décroissant avec l'âge.
- **Texte** : au point du clic, label en police **monospace sobre**
  (`font: "600 14px ui-monospace, SFMono-Regular, Menlo, monospace"`), couleur
  du tone. Animation : léger `translateY` vers le haut (`-age * k`) + fade-out
  sur la durée de vie. Pas d'effet glitch.
- **Teinte locale de la grille** : pendant qu'une onde est active, les
  points/lignes situés **dans le rayon courant de l'onde** voient leur couleur
  interpolée depuis la couleur de base (`dotColor`/`lineColor`) vers la couleur
  du tone. L'intensité de teinte = `(1 - age/WAVE_LIFE) * proximitéAuCentre`.
  Quand l'onde meurt, la couleur revient à l'état initial → « temporaire puis
  retour ». Implémentation via une petite fonction `mixHex(base, target, t)`.

Note : le calcul de teinte réutilise la distance au centre d'onde déjà calculée
pour l'impulsion physique — pas de passe supplémentaire.

## Interface du composant

Props ajoutées (toutes optionnelles, défauts fournis) — l'appel `<KineticGrid />`
reste valide :

```ts
interface KineticGridProps {
  background?: string
  dotColor?: string
  lineColor?: string
  trailColor?: string
  spacing?: number
  radius?: number
  strength?: number
  trail?: boolean
  style?: CSSProperties
  // nouveau :
  okColor?: string        // défaut "#22c55e"
  badColor?: string       // défaut "#ef4444"
  clickEffects?: boolean  // défaut true
}
```

## Ce qui ne change pas

- `position: fixed`, `inset: 0`, `zIndex: 0`, `pointer-events: none`.
- API publique existante (props actuelles conservées, mêmes défauts).
- Écoute globale souris/touch sur `window`.
- Rendu dans `App.tsx` inchangé.

## Tests / vérification

Pas de framework de test unitaire dans le repo pour du canvas animé. Vérification :

1. `npm run build` passe (TypeScript + Vite).
2. `npx tsc --noEmit -p tsconfig.app.json` n'introduit pas de nouvelle erreur
   dans `InteractiveBackground.tsx`.
3. Vérification visuelle manuelle : arrêt souris → pas de vibration ; clic →
   onde + texte coloré + teinte locale qui se résorbe ; navigation du site
   toujours cliquable (pointer-events).
```
