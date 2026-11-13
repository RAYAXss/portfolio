import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { WorkflowId } from '../../types/comfyui';
import { buildI2V } from './scenes/i2v';
import { buildI3D } from './scenes/i3d';
import { buildT2I } from './scenes/t2i';
import type { OutputBuild, SceneParams } from './scenes/types';

/* ─────────────────────────────────────────────
   OutputScene : visualisation illustrative de la sortie d'un workflow
   (image 2D, vidéo = 2D + temps, mesh 3D). Même cycle de vie que NodeScene :
   pause hors écran / onglet caché, couleurs relues au changement de thème,
   rendu à la demande si reduced-motion, contrôles seuls si WebGL indisponible.
───────────────────────────────────────────── */

const builders: Record<WorkflowId, () => OutputBuild> = { t2i: buildT2I, i2v: buildI2V, i3d: buildI3D };

const Range: React.FC<{
  label: string;
  value: number;
  display?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}> = ({ label, value, display, min, max, step = 1, onChange }) => (
  <label className="flex min-w-0 flex-1 basis-40 flex-col gap-1 text-sm text-content-muted">
    <span className="flex justify-between gap-2">
      <span>{label}</span>
      <span className="tabular-nums text-content">{display ?? value}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-accent"
    />
  </label>
);

const buttonClass = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 text-sm transition-colors ${
    active
      ? 'border-accent/50 bg-accent/10 text-content'
      : 'border-border/10 bg-glass text-content-muted hover:bg-glass-hover hover:text-content'
  }`;

export const OutputScene: React.FC<{ variant: WorkflowId }> = ({ variant }) => {
  const { t, lang } = useLanguage();
  const s = t.comfyui.scene;
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);
  const [params, setParams] = useState<SceneParams>({ steps: 30, cfg: 5, seed: 42, frames: 81, rife: true, stage: 0 });
  const paramsRef = useRef(params);
  const renderRef = useRef<(() => void) | null>(null);
  const set = (patch: Partial<SceneParams>) => setParams((p) => ({ ...p, ...patch }));

  // Contrôles → scène (sans recréer le renderer) ; en reduced-motion, un rendu par changement
  useEffect(() => {
    paramsRef.current = params;
    renderRef.current?.();
  }, [params]);

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
    const build = builders[variant]();
    scene.add(build.root);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(...build.cameraPos);
    camera.lookAt(0, 0, 0);
    build.applyColors();

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) renderStatic();
    };

    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      build.frame(Math.max(0, now - t0) / 1000, Math.min((now - last) / 1000, 0.1), paramsRef.current, reduced);
      last = now;
      renderer.render(scene, camera);
    };
    const renderStatic = () => draw(last);

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    if (reduced) {
      renderStatic();
      renderRef.current = renderStatic;
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
      build.applyColors();
      if (reduced) renderStatic();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stop();
      renderRef.current = null;
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      build.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, reduced]);

  const fmt = (n: number) => n.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="min-w-0">
      {supported && (
        <div ref={hostRef} aria-hidden="true" className="h-64 overflow-hidden rounded-xl border border-border/10 bg-surface-2 sm:h-80" />
      )}
      <p className="mt-2 text-xs text-content-faint">{s.illustrative}</p>
      <p className="mt-3 text-sm text-content-muted">{s.captions[variant]}</p>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        {variant === 't2i' && (
          <>
            <Range label={s.steps} value={params.steps} min={1} max={50} onChange={(steps) => set({ steps })} />
            <Range label={s.cfg} value={params.cfg} min={1} max={15} onChange={(cfg) => set({ cfg })} />
            <div className="flex items-center gap-3 text-sm text-content-muted">
              <span>
                {s.seed} <span className="tabular-nums text-content">{params.seed}</span>
              </span>
              <button type="button" className={buttonClass(false)} onClick={() => set({ seed: Math.floor(Math.random() * 1000) })}>
                {s.newSeed}
              </button>
            </div>
          </>
        )}

        {variant === 'i2v' && (
          <>
            <Range label={s.frames} value={params.frames} min={17} max={81} step={16} onChange={(frames) => set({ frames })} />
            <label className="flex items-center gap-2 text-sm text-content-muted">
              <input type="checkbox" checked={params.rife} onChange={(e) => set({ rife: e.target.checked })} className="accent-accent" />
              {s.rife}
            </label>
            <p className="w-full text-sm text-content-muted">
              {s.duration} <span className="tabular-nums text-content">{fmt(params.frames / 16)} s</span> · {s.fps}{' '}
              <span className="tabular-nums text-content">{params.rife ? 32 : 16} fps</span>
            </p>
          </>
        )}

        {variant === 'i3d' && (
          <>
            <Range
              label={s.stage}
              value={params.stage}
              display={s.stages[params.stage]}
              min={0}
              max={3}
              onChange={(stage) => set({ stage })}
            />
            <div className="flex flex-wrap gap-2">
              {s.stages.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={params.stage === i}
                  className={buttonClass(params.stage === i)}
                  onClick={() => set({ stage: i })}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
