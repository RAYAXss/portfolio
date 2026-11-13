import * as THREE from 'three';
import { cssColor } from '../../three/cssColor';
import type { OutputBuild } from './types';

/* T2I : plan dont le shader mélange un bruit (seed) et une image procédurale.
   La progression est quantifiée en `steps` paliers ; `cfg` pousse contraste/saturation (posterisé > 10). */

const fragmentShader = /* glsl */ `
uniform float uSeed, uProgress, uCfg, uSteps;
uniform vec3 uA, uB, uBg;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 1.37) * 43758.5453); }
void main() {
  vec2 uv = vUv;
  vec3 img = mix(uBg, uB, uv.y * 0.5);
  for (int k = 0; k < 4; k++) {
    float fk = float(k) + 1.0;
    vec2 c = 0.2 + 0.6 * vec2(hash(vec2(fk, 1.7)), hash(vec2(3.1, fk)));
    float r = 0.1 + 0.16 * hash(vec2(fk, 9.2));
    img = mix(img, mod(fk, 2.0) < 1.0 ? uB : uA, 1.0 - smoothstep(r - 0.015, r, length(uv - c)));
  }
  vec2 px = floor(uv * 96.0);
  vec3 noise = vec3(hash(px), hash(px + 17.0), hash(px + 41.0));
  float residual = clamp(1.0 - uProgress + 0.5 / uSteps, 0.0, 1.0);
  vec3 col = mix(img, noise, residual);
  float k = uCfg / 5.0;
  float g = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(g), col, 0.6 + 0.4 * k);
  col = clamp((col - 0.5) * (0.7 + 0.3 * k) + 0.5, 0.0, 1.0);
  if (uCfg > 10.0) {
    float levels = mix(10.0, 3.0, (uCfg - 10.0) / 5.0);
    col = floor(col * levels + 0.5) / levels;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

export const buildT2I = (): OutputBuild => {
  const geo = new THREE.PlaneGeometry(2.4, 2.4);
  const uniforms = {
    uSeed: { value: 0 },
    uProgress: { value: 1 },
    uCfg: { value: 5 },
    uSteps: { value: 30 },
    uA: { value: new THREE.Color() },
    uB: { value: new THREE.Color() },
    uBg: { value: new THREE.Color() },
  };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const root = new THREE.Mesh(geo, mat);

  return {
    root,
    cameraPos: [0, 0, 4.2],
    applyColors: () => {
      uniforms.uA.value.copy(cssColor('--accent'));
      uniforms.uB.value.copy(cssColor('--accent-2'));
      uniforms.uBg.value.copy(cssColor('--surface-2'));
    },
    frame: (t, _dt, p, reduced) => {
      uniforms.uSeed.value = p.seed;
      uniforms.uCfg.value = p.cfg;
      uniforms.uSteps.value = p.steps;
      // Boucle de 5 s : 4 s de débruitage par paliers, 1 s sur l'image finale
      const phase = Math.min((t % 5) / 4, 1);
      uniforms.uProgress.value = reduced ? 1 : Math.floor(phase * p.steps) / p.steps;
      root.rotation.y = reduced ? 0 : Math.sin(t * 0.3) * 0.12;
    },
    dispose: () => {
      geo.dispose();
      mat.dispose();
    },
  };
};
