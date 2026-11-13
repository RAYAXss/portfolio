import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ─────────────────────────────────────────────
   NodeScene : graphe 3D décoratif (nœuds + liens + particules
   qui circulent le long des liens). Partagé par les sous-pages.
   - Couleurs lues dans les tokens CSS (--accent, --accent-2), relues au changement de thème
   - Pause hors écran / onglet caché, une seule frame si reduced-motion
   - Rien n'est rendu si WebGL est indisponible (purement décoratif)
───────────────────────────────────────────── */

export type NodeShape = 'box' | 'ico' | 'sphere' | 'octa';

export interface SceneNode {
  pos: [number, number, number];
  shape?: NodeShape;
  size?: number;
}

interface NodeSceneProps {
  nodes: SceneNode[];
  edges: [number, number][];
  /** Vitesse de rotation du graphe autour de Y (rad/s) */
  spin?: number;
  /** Recul de la caméra */
  distance?: number;
  className?: string;
}

const cssColor = (name: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [r, g, b] = raw.split(/\s+/).map(Number);
  return Number.isFinite(r) ? new THREE.Color(r / 255, g / 255, b / 255) : new THREE.Color(0x60a5fa);
};

const makeGeometry = (shape: NodeShape, size: number) => {
  switch (shape) {
    case 'box':
      return new THREE.BoxGeometry(size, size, size);
    case 'sphere':
      return new THREE.SphereGeometry(size * 0.6, 20, 14);
    case 'octa':
      return new THREE.OctahedronGeometry(size * 0.7);
    default:
      return new THREE.IcosahedronGeometry(size * 0.65, 0);
  }
};

const NodeScene: React.FC<NodeSceneProps> = ({ nodes, edges, spin = 0.15, distance = 9, className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setSupported(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, distance);
    camera.lookAt(0, 0, 0);

    const graph = new THREE.Group();
    scene.add(graph);

    // Matériaux partagés → un seul endroit à recolorer au changement de thème
    const fillMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.18 });
    const wireMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });
    const linkMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 });
    const pulseMat = new THREE.MeshBasicMaterial();
    const applyColors = () => {
      const accent = cssColor('--accent');
      const accent2 = cssColor('--accent-2');
      fillMat.color.copy(accent);
      wireMat.color.copy(accent);
      linkMat.color.copy(accent2);
      pulseMat.color.copy(accent2);
    };
    applyColors();

    const disposables: { dispose: () => void }[] = [fillMat, wireMat, linkMat, pulseMat];
    const nodeMeshes: THREE.Object3D[] = [];

    nodes.forEach((n) => {
      const geo = makeGeometry(n.shape ?? 'ico', n.size ?? 1);
      const edgesGeo = new THREE.EdgesGeometry(geo);
      disposables.push(geo, edgesGeo);
      const holder = new THREE.Group();
      holder.add(new THREE.Mesh(geo, fillMat));
      holder.add(new THREE.LineSegments(edgesGeo, wireMat));
      holder.position.set(...n.pos);
      graph.add(holder);
      nodeMeshes.push(holder);
    });

    const pulseGeo = new THREE.SphereGeometry(0.07, 10, 8);
    disposables.push(pulseGeo);
    const pulses = edges.map(([a, b], i) => {
      const from = new THREE.Vector3(...nodes[a].pos);
      const to = new THREE.Vector3(...nodes[b].pos);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
      disposables.push(lineGeo);
      graph.add(new THREE.Line(lineGeo, linkMat));
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      graph.add(pulse);
      return { from, to, pulse, offset: i / Math.max(edges.length, 1) };
    });

    // Inclinaison douce selon le pointeur
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
    };
    host.addEventListener('pointermove', onPointer);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;

    const draw = (t: number) => {
      graph.rotation.y += (t * spin + target.y - graph.rotation.y) * 0.05;
      graph.rotation.x += (target.x - graph.rotation.x) * 0.05;
      nodeMeshes.forEach((m, i) => {
        m.rotation.x = t * 0.3 + i;
        m.rotation.y = t * 0.4 + i;
      });
      pulses.forEach((p) => {
        const k = (t * 0.35 + p.offset) % 1;
        p.pulse.position.lerpVectors(p.from, p.to, k);
      });
      renderer.render(scene, camera);
    };

    const loop = () => {
      draw(clock.getElapsedTime());
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduced) {
      graph.rotation.y = 0.4;
      draw(0.4 / Math.max(spin, 0.01));
    } else {
      start();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    // Recolore au changement de thème (<html data-theme>)
    const mo = new MutationObserver(() => {
      applyColors();
      if (reduced) renderer.render(scene, camera);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.forceContextLoss();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [nodes, edges, spin, distance, reduced]);

  if (!supported) return null;
  return <div ref={hostRef} aria-hidden="true" className={className} />;
};

export default NodeScene;
