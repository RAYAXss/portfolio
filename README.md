# Portfolio - Quentin COLPART

Personal portfolio built with React + TypeScript + Vite + Tailwind CSS + Framer Motion.

## 🚀 Initial Setup

### 1. Clone the repository
```bash
git clone https://github.com/RAYAXss/portfolio.git
cd portfolio
git checkout portfolio-redesign
```

### 2. Install dependencies
```bash
npm install
```

This will install all libraries defined in `package.json`:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

**Note:** The `node_modules/` folder is git-ignored (defined in `.gitignore`) and will never be pushed to GitHub.

### 3. Add your personal files

#### CV and Documents
Create the folder and add your PDFs:
```bash
mkdir -p public/doc
# Place your CV files here
cp /path/to/your/CV.pdf public/doc/
```

#### Images
Add your photos/images:
```bash
mkdir -p public/images
# Place your images here
cp /path/to/your/images/* public/images/
```

**Protected personal files:** The following files will **never** be committed (defined in `.gitignore`):
- `public/doc/*.pdf` - CVs and documents
- `public/doc/*.png` - CV screenshots
- `public/images/profile*` - Profile photos
- `public/images/pp_*` - Personal photos

### 4. Start development server
```bash
npm run dev
```

Opens automatically at `http://localhost:5173/portfolio/`

## 📁 Personal Files Structure

```
public/
├── doc/                    # ← Add your CVs here
│   ├── CV.pdf
│   └── CV.png
└── images/                 # ← Add your images here
    ├── profile.jpg
    ├── fond.jpg
    ├── pp_solutec.jpg
    └── favicon.ico         (already present)
```

## 🔧 Available Commands

```bash
npm run dev        # Start development server
npm run build      # Production build in dist/
npm run preview    # Preview production build
npm run lint       # ESLint linter
npm run typecheck  # TypeScript type checking
```

## 📦 What's in Git vs Ignored

### ✅ Committed to Git
- Source code (`src/`)
- Configuration (Vite, TypeScript, Tailwind, ESLint)
- `package.json` and `package-lock.json`
- `public/images/favicon.ico`

### ❌ Ignored by Git (`.gitignore`)
- `node_modules/` - Dependencies (reinstalled via `npm install`)
- `dist/` - Production build
- `public/doc/` - CVs and personal documents
- `public/images/*.jpg`, `*.png` - Personal photos
- `.vscode/`, `.idea/` - IDE config
- Logs and temporary files

## 🌐 Deployment

### Build for production
```bash
npm run build
```

The `dist/` folder contains files ready to deploy to:
- GitHub Pages
- Vercel
- Netlify
- Any static host

**Important:** Before deploying, verify that your personal files (CVs, photos) are present locally in `public/`.

## 🔄 Git Workflow

```bash
# After adding your personal files locally
git status                           # Verify they are NOT listed
git add src/ package.json README.md  # Add only the code
git commit -m "Update: description"
git push origin portfolio-redesign
```

Files in `public/doc/` and `public/images/` will remain **only on your machine** and will never be pushed.

## 📝 Notes

- **Node.js required:** Version 18+ recommended
- **First install:** `npm install` may take 1-2 minutes
- **Hot reload:** Code changes reflect instantly in browser
- **TypeScript:** Strict typing enabled for better code quality
