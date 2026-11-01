import type { Language } from '../types/language';
import type { ComfyUIWorkflow } from '../types/comfyui';

const workflowsFR: ComfyUIWorkflow[] = [
  {
    id: 'flux2',
    title: 'FLUX.2 Klein 9B — Image réaliste',
    description: 'Génération d\'images réalistes avec le modèle de diffusion FLUX.2 Klein 9B, encodeur texte Qwen 3 8B et VAE dédié. Prompting structuré par blocs (sujet, pose, éclairage, caméra).',
    features: [
      'Personnages et objets réalistes',
      'Références pour reconstruction 3D',
      'Poses d\'action dynamiques',
      'Édition d\'image guidée par texte',
    ],
    techStack: ['FLUX.2', 'Qwen 3 8B', 'ComfyUI'],
    icon: 'image',
  },
  {
    id: 'anime',
    title: 'Modèle Anime — Image stylisée',
    description: 'Génération d\'images anime et stylisées avec un checkpoint dédié (base SDXL), LoRA et upscale. Stratégie de prompt spécifique au style anime.',
    features: [
      'Character design cohérent',
      'Poses d\'action anime',
      'Consistance multi-vues',
      'Upscale intégré',
    ],
    techStack: ['SDXL', 'LoRA', 'ComfyUI'],
    icon: 'palette',
  },
  {
    id: 'video',
    title: 'Wan 2.2 — Vidéo',
    description: 'Pipeline vidéo complet avec Wan 2.2 14B : texte vers vidéo, image vers vidéo, et interpolation first/last frame. Interpolation RIFE 32 fps et audio MMAudio.',
    features: [
      'Texte → Vidéo',
      'Image → Vidéo',
      'First + Last frame → Vidéo',
      'Audio automatique (MMAudio)',
    ],
    techStack: ['Wan 2.2', 'RIFE', 'MMAudio', 'ComfyUI'],
    icon: 'video',
  },
  {
    id: 'trellis2',
    title: 'TRELLIS.2 — Reconstruction 3D',
    description: 'Reconstruction image vers mesh 3D avec Microsoft TRELLIS.2-4B. Pipeline entièrement piloté par l\'image, aucun prompt texte requis. Support mono et multi-vues.',
    features: [
      'Image unique → Mesh 3D',
      'Multi-vues (front/back) → Mesh',
      'Export GLB',
      'Simplification et remplissage automatique',
    ],
    techStack: ['TRELLIS.2', 'DINOv3', 'ComfyUI'],
    icon: 'box',
  },
];

const workflowsEN: ComfyUIWorkflow[] = [
  {
    id: 'flux2',
    title: 'FLUX.2 Klein 9B — Realistic Image',
    description: 'Realistic image generation with the FLUX.2 Klein 9B diffusion model, Qwen 3 8B text encoder and dedicated VAE. Structured block prompting (subject, pose, lighting, camera).',
    features: [
      'Realistic characters and objects',
      'References for 3D reconstruction',
      'Dynamic action poses',
      'Text-guided image editing',
    ],
    techStack: ['FLUX.2', 'Qwen 3 8B', 'ComfyUI'],
    icon: 'image',
  },
  {
    id: 'anime',
    title: 'Anime Model — Stylized Image',
    description: 'Anime and stylized image generation with a dedicated checkpoint (SDXL base), LoRA and upscale. Anime-specific prompt strategy.',
    features: [
      'Consistent character design',
      'Anime action poses',
      'Multi-view consistency',
      'Built-in upscale',
    ],
    techStack: ['SDXL', 'LoRA', 'ComfyUI'],
    icon: 'palette',
  },
  {
    id: 'video',
    title: 'Wan 2.2 — Video',
    description: 'Complete video pipeline with Wan 2.2 14B: text to video, image to video, and first/last frame interpolation. RIFE 32 fps interpolation and MMAudio.',
    features: [
      'Text → Video',
      'Image → Video',
      'First + Last frame → Video',
      'Automatic audio (MMAudio)',
    ],
    techStack: ['Wan 2.2', 'RIFE', 'MMAudio', 'ComfyUI'],
    icon: 'video',
  },
  {
    id: 'trellis2',
    title: 'TRELLIS.2 — 3D Reconstruction',
    description: 'Image to 3D mesh reconstruction with Microsoft TRELLIS.2-4B. Fully image-driven pipeline, no text prompt required. Single and multi-view support.',
    features: [
      'Single image → 3D Mesh',
      'Multi-view (front/back) → Mesh',
      'GLB export',
      'Automatic simplification and hole filling',
    ],
    techStack: ['TRELLIS.2', 'DINOv3', 'ComfyUI'],
    icon: 'box',
  },
];

export const getComfyUIWorkflows = (lang: Language): ComfyUIWorkflow[] =>
  lang === 'fr' ? workflowsFR : workflowsEN;
