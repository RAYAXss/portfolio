# Portfolio - Quentin COLPART

Portfolio personnel développé avec React + TypeScript + Vite + Tailwind CSS + Framer Motion.

## 🚀 Setup Initial

### 1. Cloner le repo
```bash
git clone https://github.com/RAYAXss/portfolio.git
cd portfolio
git checkout portfolio-redesign
```

### 2. Installer les dépendances
```bash
npm install
```

Ceci installera toutes les librairies définies dans `package.json` :
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icônes)

**Note:** Le dossier `node_modules/` est ignoré par git (défini dans `.gitignore`) et ne sera jamais poussé sur GitHub.

### 3. Ajouter vos fichiers personnels

#### CV et Documents
Créer le dossier et ajouter vos PDFs :
```bash
mkdir -p public/doc
# Placer vos fichiers CV ici
cp /chemin/vers/votre/CV.pdf public/doc/
```

#### Images
Ajouter vos photos/images :
```bash
mkdir -p public/images
# Placer vos images ici
cp /chemin/vers/vos/images/* public/images/
```

**Fichiers personnels protégés :** Les fichiers suivants ne seront **jamais** commités (définis dans `.gitignore`) :
- `public/doc/*.pdf` - CVs et documents
- `public/doc/*.png` - Screenshots de CV
- `public/images/profile*` - Photos de profil
- `public/images/pp_*` - Photos personnelles

### 4. Lancer le serveur de développement
```bash
npm run dev
```

Ouvre automatiquement sur `http://localhost:5173/portfolio/`

## 📁 Structure des Fichiers Personnels

```
public/
├── doc/                    # ← Ajouter vos CVs ici
│   ├── CV.pdf
│   └── CV.png
└── images/                 # ← Ajouter vos images ici
    ├── profile.jpg
    ├── fond.jpg
    ├── pp_solutec.jpg
    └── favicon.ico         (déjà présent)
```

## 🔧 Commandes Disponibles

```bash
npm run dev        # Lancer serveur de développement
npm run build      # Build production dans dist/
npm run preview    # Preview du build production
npm run lint       # Linter ESLint
npm run typecheck  # Vérification TypeScript
```

## 📦 Ce qui est dans Git vs Ignoré

### ✅ Commité dans Git
- Code source (`src/`)
- Configuration (Vite, TypeScript, Tailwind, ESLint)
- `package.json` et `package-lock.json`
- `public/images/favicon.ico`

### ❌ Ignoré par Git (`.gitignore`)
- `node_modules/` - Dépendances (réinstallées via `npm install`)
- `dist/` - Build de production
- `public/doc/` - CVs et documents personnels
- `public/images/*.jpg`, `*.png` - Photos personnelles
- `.vscode/`, `.idea/` - Config IDE
- Logs et fichiers temporaires

## 🌐 Déploiement

### Build pour production
```bash
npm run build
```

Le dossier `dist/` contient les fichiers prêts à déployer sur :
- GitHub Pages
- Vercel
- Netlify
- Tout hébergeur statique

**Important :** Avant de déployer, vérifier que vos fichiers personnels (CVs, photos) sont bien présents localement dans `public/`.

## 🔄 Workflow Git

```bash
# Après avoir ajouté vos fichiers personnels localement
git status                           # Vérifier qu'ils ne sont PAS listés
git add src/ package.json README.md  # Ajouter uniquement le code
git commit -m "Update: description"
git push origin portfolio-redesign
```

Les fichiers dans `public/doc/` et `public/images/` resteront **uniquement sur votre machine** et ne seront jamais poussés.

## 📝 Notes

- **Node.js requis :** Version 18+ recommandée
- **Première installation :** `npm install` peut prendre 1-2 minutes
- **Hot reload :** Les modifications de code se reflètent instantanément dans le navigateur
- **TypeScript :** Typage strict activé pour meilleure qualité de code
