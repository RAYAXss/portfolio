import type * as THREE from 'three';

/** État des contrôles d'OutputScene ; chaque variante ne lit que ses champs. */
export interface SceneParams {
  steps: number;
  cfg: number;
  seed: number;
  frames: number;
  rife: boolean;
  stage: number;
}

export interface OutputBuild {
  root: THREE.Object3D;
  cameraPos: [number, number, number];
  /** Relit les tokens CSS (appelé au montage et à chaque changement de thème) */
  applyColors: () => void;
  /** t, dt en secondes ; reduced = rendu statique (pas d'interpolation) */
  frame: (t: number, dt: number, p: SceneParams, reduced: boolean) => void;
  dispose: () => void;
}
