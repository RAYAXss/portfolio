import * as THREE from 'three';
import { cssColor } from '../../three/cssColor';
import type { OutputBuild } from './types';

/* I2V : pile de frames le long de Z (le temps). Une forme saute de frame en frame ;
   RIFE double le nombre de frames (frames intermédiaires plus discrètes). */

const DEPTH = 4;

export const buildI2V = (): OutputBuild => {
  const planeGeo = new THREE.PlaneGeometry(1.6, 0.92);
  const edgeGeo = new THREE.EdgesGeometry(planeGeo);
  const dotGeo = new THREE.CircleGeometry(0.1, 24);
  const moverGeo = new THREE.SphereGeometry(0.13, 20, 14);
  const fillMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false });
  const edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7 });
  const interMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.3 });
  const dotMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
  const moverMat = new THREE.MeshBasicMaterial();

  const root = new THREE.Group();
  const stack = new THREE.Group();
  root.add(stack);
  const mover = new THREE.Mesh(moverGeo, moverMat);
  stack.add(mover);

  // Trajectoire de la forme dans le cadre, u ∈ [0, 1]
  const path = (u: number) => new THREE.Vector3(-0.55 + 1.1 * u, 0.22 * Math.sin(u * Math.PI * 2), 0);
  let frames: THREE.Group[] = [];
  let key = '';

  const rebuild = (n: number, rife: boolean) => {
    frames.forEach((f) => stack.remove(f)); // géométries/matériaux partagés : rien à libérer ici
    frames = Array.from({ length: n }, (_, i) => {
      const u = i / (n - 1);
      const f = new THREE.Group();
      f.add(new THREE.Mesh(planeGeo, fillMat));
      f.add(new THREE.LineSegments(edgeGeo, rife && i % 2 === 1 ? interMat : edgeMat));
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(path(u));
      f.add(dot);
      f.position.z = DEPTH / 2 - u * DEPTH;
      stack.add(f);
      return f;
    });
  };

  return {
    root,
    cameraPos: [3.4, 1.5, 3.8],
    applyColors: () => {
      const accent = cssColor('--accent');
      const accent2 = cssColor('--accent-2');
      fillMat.color.copy(accent);
      edgeMat.color.copy(accent);
      interMat.color.copy(accent2);
      dotMat.color.copy(accent2);
      moverMat.color.copy(accent);
    },
    frame: (t, _dt, p, reduced) => {
      const base = Math.max(2, Math.round(p.frames / 8));
      const n = Math.min(20, p.rife ? base * 2 : base);
      if (key !== `${n}-${p.rife}`) {
        key = `${n}-${p.rife}`;
        rebuild(n, p.rife);
      }
      // Saut discret de frame en frame : plus de frames = mouvement plus fluide
      const idx = reduced ? Math.floor(n / 2) : Math.floor(((t / 3) % 1) * n);
      mover.position.copy(path(idx / (n - 1))).setZ(frames[idx].position.z + 0.02);
      stack.rotation.y = reduced ? 0 : Math.sin(t * 0.25) * 0.2;
    },
    dispose: () => {
      [planeGeo, edgeGeo, dotGeo, moverGeo, fillMat, edgeMat, interMat, dotMat, moverMat].forEach((d) => d.dispose());
    },
  };
};
