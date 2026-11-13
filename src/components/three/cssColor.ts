import * as THREE from 'three';

/** Lit un token CSS « r g b » (ex. --accent) sur <html> et le convertit en THREE.Color. */
export const cssColor = (name: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [r, g, b] = raw.split(/\s+/).map(Number);
  return Number.isFinite(r) ? new THREE.Color(r / 255, g / 255, b / 255) : new THREE.Color(0x60a5fa);
};
