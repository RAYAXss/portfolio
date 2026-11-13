import * as THREE from 'three';
import { cssColor } from '../../three/cssColor';
import type { OutputBuild } from './types';

/* I3D : image (grille de points) → voxels clairsemés → points sur un icosaèdre → mesh plein + fil de fer.
   L'étape affichée (`shown`) glisse vers l'étape choisie ; instantané si reduced-motion. */

const GRID = 24;
const COUNT = GRID * GRID;
const VOXEL = 0.25;

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

export const buildI3D = (): OutputBuild => {
  const image = new Float32Array(COUNT * 3);
  const voxels = new Float32Array(COUNT * 3);
  const shape = new Float32Array(COUNT * 3);
  const surfaceGeo = new THREE.IcosahedronGeometry(1.1, 3);
  const surface = surfaceGeo.getAttribute('position');
  const dir = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    image.set([-1 + (2 * ((i % GRID) + 0.5)) / GRID, -1 + (2 * (Math.floor(i / GRID) + 0.5)) / GRID, 0], i * 3);
    dir.randomDirection().multiplyScalar(1.1 * Math.cbrt(Math.random()));
    voxels.set([dir.x, dir.y, dir.z].map((v) => Math.round(v / VOXEL) * VOXEL), i * 3);
    const k = (i * 7) % surface.count;
    shape.set([surface.getX(k), surface.getY(k), surface.getZ(k)], i * 3);
  }

  const pointsGeo = new THREE.BufferGeometry();
  const positions = new THREE.BufferAttribute(image.slice(), 3);
  pointsGeo.setAttribute('position', positions);
  const pointsMat = new THREE.PointsMaterial({ size: 0.06, transparent: true });
  const imgGeo = new THREE.PlaneGeometry(2.1, 2.1);
  const imgMat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const meshGeo = new THREE.IcosahedronGeometry(1.1, 2);
  const wireGeo = new THREE.WireframeGeometry(meshGeo);
  const meshMat = new THREE.MeshPhongMaterial({ flatShading: true, transparent: true });
  const wireMat = new THREE.LineBasicMaterial({ transparent: true });

  const root = new THREE.Group();
  const points = new THREE.Points(pointsGeo, pointsMat);
  const imgPlane = new THREE.Mesh(imgGeo, imgMat);
  imgPlane.position.z = -0.01;
  const mesh = new THREE.Mesh(meshGeo, meshMat);
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  const light = new THREE.DirectionalLight(undefined, 2);
  light.position.set(2, 3, 4);
  root.add(points, imgPlane, mesh, wire, new THREE.AmbientLight(undefined, 0.9), light);

  let shown = 0;
  let drawn = -1;

  return {
    root,
    cameraPos: [0, 0.6, 4.4],
    applyColors: () => {
      const accent = cssColor('--accent');
      const accent2 = cssColor('--accent-2');
      pointsMat.color.copy(accent);
      imgMat.color.copy(accent2);
      meshMat.color.copy(accent2);
      wireMat.color.copy(accent);
    },
    frame: (t, dt, p, reduced) => {
      shown = reduced || Math.abs(p.stage - shown) < 0.001 ? p.stage : shown + (p.stage - shown) * Math.min(1, dt * 3);
      if (shown !== drawn) {
        drawn = shown;
        const [from, to, k] = shown < 1 ? [image, voxels, shown] : [voxels, shape, shown - 1];
        const e = smooth(clamp01(k));
        for (let i = 0; i < COUNT * 3; i++) positions.array[i] = from[i] + (to[i] - from[i]) * e;
        positions.needsUpdate = true;
        const solid = clamp01(shown - 2);
        imgMat.opacity = 0.25 * (1 - clamp01(shown));
        imgPlane.visible = imgMat.opacity > 0;
        pointsMat.opacity = 1 - 0.85 * solid;
        meshMat.opacity = solid * 0.9;
        wireMat.opacity = solid * 0.8;
        mesh.visible = wire.visible = solid > 0;
      }
      root.rotation.set(0.15, reduced ? 0.5 : t * 0.3, 0);
    },
    dispose: () => {
      [surfaceGeo, pointsGeo, pointsMat, imgGeo, imgMat, meshGeo, wireGeo, meshMat, wireMat].forEach((d) => d.dispose());
      light.dispose();
    },
  };
};
