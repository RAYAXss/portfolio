import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Package, Type, Layers, Sparkles, ScanLine, SlidersHorizontal, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Flow, FlowEdge, FlowNode, FlowNodeKind, WireType } from '../../types/flow';
import { topoOrder } from '../../utils/flow';
import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const NODE_W = 152;
const NODE_H = 60;
const COL_GAP = 40;
const ROW_GAP = 20;
const PAD = 12; // marge haut/bas : les câbles de retour passent dans la gouttière au-delà de la première/dernière rangée
const STUB = 16; // distance horizontale entre le bord d'un nœud et le virage d'un câble de retour

const ICONS: Record<FlowNodeKind, LucideIcon> = {
  input: Download,
  loader: Package,
  text: Type,
  latent: Layers,
  sampler: Sparkles,
  decode: ScanLine,
  post: SlidersHorizontal,
  output: Flag,
};

const WIRE_ORDER: WireType[] = ['MODEL', 'CLIP', 'VAE', 'CONDITIONING', 'LATENT', 'IMAGE', 'VIDEO', 'MESH'];

const wireColor = (type?: WireType) => `rgb(var(--wire-${type ? type.toLowerCase() : 'neutral'}))`;

/** Câble : Bézier horizontale si l'arête avance, sinon contournement par la gouttière entre les rangées. */
function edgePath(s: FlowNode, t: FlowNode): string {
  const sx = s.col * (NODE_W + COL_GAP) + NODE_W;
  const sy = PAD + s.row * (NODE_H + ROW_GAP) + NODE_H / 2;
  const tx = t.col * (NODE_W + COL_GAP);
  const ty = PAD + t.row * (NODE_H + ROW_GAP) + NODE_H / 2;
  if (t.col > s.col) {
    const dx = Math.max(24, (tx - sx) / 2);
    return `M${sx},${sy} C${sx + dx},${sy} ${tx - dx},${ty} ${tx},${ty}`;
  }
  const gy = ty >= sy ? sy + NODE_H / 2 + ROW_GAP / 2 : sy - NODE_H / 2 - ROW_GAP / 2;
  return `M${sx},${sy} H${sx + STUB} V${gy} H${tx - STUB} V${ty} H${tx}`;
}

const WireTag: React.FC<{ type?: WireType; label: string }> = ({ type, label }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-content-muted">
    <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full" style={{ background: wireColor(type) }} />
    {label}
  </span>
);

export const InteractiveFlow: React.FC<{ flow: Flow; showLegend?: boolean }> = ({ flow, showLegend = true }) => {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const order = useMemo(() => topoOrder(flow), [flow]);
  const byId = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow]);
  const [selected, setSelected] = useState(order[0]?.id ?? '');
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Nouveau graphe : on garde la sélection si le nœud existe encore (changement de langue), sinon retour au premier.
  const selectedId = byId.has(selected) ? selected : order[0]?.id ?? '';

  const node = byId.get(selectedId);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const index = order.findIndex((n) => n.id === selectedId);
  const openSheet = (id: string) => {
    setSelected(id);
    if (!sheetRef.current?.open) sheetRef.current?.showModal();
  };
  const step = (d: number) => {
    const next = order[index + d];
    if (next) setSelected(next.id);
  };
  const activeId = hoverId ?? selectedId;
  const neutral = t.flowUi.neutralWire;
  const typeLabel = (type?: WireType) => type ?? neutral;
  const cols = Math.max(...flow.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...flow.nodes.map((n) => n.row)) + 1;
  const width = cols * (NODE_W + COL_GAP) - COL_GAP;
  const height = rows * (NODE_H + ROW_GAP) - ROW_GAP + 2 * PAD;
  const present = WIRE_ORDER.filter((w) => flow.edges.some((e) => e.type === w));
  const hasNeutral = flow.edges.some((e) => !e.type);

  const links = (dir: 'in' | 'out', id: string) =>
    flow.edges.filter((e) => (dir === 'in' ? e.to : e.from) === id);

  const renderLinks = (title: string, dir: 'in' | 'out', id: string) => {
    const list: FlowEdge[] = links(dir, id);
    if (!list.length) return null;
    return (
      <div>
        <h4 className="text-xs uppercase tracking-wide text-content-faint mb-1.5">{title}</h4>
        <ul className="space-y-1">
          {list.map((e, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-content-muted">
              <WireTag type={e.type} label={typeLabel(e.type)} />
              <span className="text-content">{byId.get(dir === 'in' ? e.from : e.to)?.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const panel = node && (
    <div className="rounded-xl border border-border/10 bg-surface-2 p-4 sm:p-5 space-y-4">
      <h3 className="text-base font-semibold text-content">{node.label}</h3>
      <p className="text-sm text-content-muted leading-relaxed">{node.detail}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {renderLinks(t.flowUi.inputs, 'in', node.id)}
        {renderLinks(t.flowUi.outputs, 'out', node.id)}
      </div>
      {node.params && node.params.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wide text-content-faint mb-1.5">{t.flowUi.params}</h4>
          <table className="hidden sm:table w-full text-sm text-left">
            <thead>
              <tr className="text-content-faint text-xs">
                <th scope="col" className="py-1 pr-3 font-medium">{t.flowUi.param}</th>
                <th scope="col" className="py-1 pr-3 font-medium">{t.flowUi.value}</th>
                <th scope="col" className="py-1 font-medium">{t.flowUi.explain}</th>
              </tr>
            </thead>
            <tbody>
              {node.params.map((p) => (
                <tr key={p.name} className="border-t border-border/10 align-top">
                  <td className="py-1.5 pr-3 font-mono text-xs text-content">{p.name}</td>
                  <td className="py-1.5 pr-3 font-mono text-xs text-accent">{p.value}</td>
                  <td className="py-1.5 text-content-muted">{p.explain}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="sm:hidden space-y-2">
            {node.params.map((p) => (
              <div key={p.name} className="border-t border-border/10 pt-2 text-sm">
                <dt className="font-mono text-xs text-content">
                  {p.name} <span className="text-accent">{p.value}</span>
                </dt>
                <dd className="text-content-muted">{p.explain}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );

  const hoverNode = hoverId ? byId.get(hoverId) : undefined;

  return (
    <div className="space-y-4">
      {/* Région live persistante : annonce la sélection (le panneau, lui, est remonté à chaque changement) */}
      <p className="sr-only" aria-live="polite">{node ? `${node.label} — ${node.summary}` : ''}</p>
      {/* >= lg : graphe câblé */}
      <div className="hidden lg:block">
        <div>
          <div className="relative mx-auto" style={{ width, height }}>
            <svg className="absolute inset-0 overflow-visible" width={width} height={height} aria-hidden="true">
              {flow.edges.map((e, i) => {
                const s = byId.get(e.from);
                const tg = byId.get(e.to);
                if (!s || !tg) return null;
                const d = edgePath(s, tg);
                const on = e.from === activeId || e.to === activeId;
                const color = wireColor(e.type);
                return (
                  <g key={i} style={{ transition: 'opacity 150ms' }} opacity={on ? 1 : 0.25}>
                    <path d={d} fill="none" stroke={color} strokeWidth={on ? 3 : 1.5} strokeLinejoin="round" />
                    {on && !reduced && (
                      <circle r="3.5" fill={color}>
                        <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
            {flow.nodes.map((n) => {
              const Icon = ICONS[n.kind];
              const sel = n.id === selectedId;
              return (
                <button
                  key={n.id}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => setSelected(n.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverId(n.id)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setHoverId(null)}
                  onFocus={() => setHoverId(n.id)}
                  onBlur={() => setHoverId(null)}
                  style={{ left: n.col * (NODE_W + COL_GAP), top: PAD + n.row * (NODE_H + ROW_GAP), width: NODE_W, height: NODE_H }}
                  className={`absolute flex items-center gap-2 px-3 rounded-lg border text-left text-sm font-medium text-content transition-colors ${
                    sel ? 'border-accent bg-accent/10' : 'border-border/10 bg-surface-2 hover:border-accent/50'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
                  <span className={`min-w-0 leading-tight [overflow-wrap:anywhere] ${n.label.length > 18 ? 'text-xs' : ''}`}>{n.label}</span>
                </button>
              );
            })}
            {hoverNode && (
              <div
                role="tooltip"
                style={{
                  left: Math.max(0, Math.min(hoverNode.col * (NODE_W + COL_GAP), width - 224)),
                  top: PAD + hoverNode.row * (NODE_H + ROW_GAP) + NODE_H + 4,
                }}
                className="pointer-events-none absolute z-20 w-56 rounded-lg border border-border-strong bg-surface-2 p-2 text-xs text-content-muted shadow-lg"
              >
                {hoverNode.summary}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-content-faint">{t.flowUi.hint}</p>
        <div className="mt-4">{panel}</div>
      </div>

      {/* < lg : étapes numérotées ; le détail s'ouvre dans une feuille en bas d'écran */}
      <div className="lg:hidden">
        <p className="mb-3 text-xs text-content-faint">{t.flowUi.tapHint}</p>
        <ol>
          {order.map((n, i) => {
            const Icon = ICONS[n.kind];
            const sel = n.id === selectedId;
            const ins = [...new Set(links('in', n.id).map((e) => e.type))];
            const outs = [...new Set(links('out', n.id).map((e) => e.type))];
            return (
              <li key={n.id} className="relative pl-11 pb-3 last:pb-0">
                {i < order.length - 1 && (
                  <span aria-hidden="true" className="absolute left-4 top-9 bottom-0 w-px bg-border/20" />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    sel ? 'bg-accent/20 text-accent ring-2 ring-accent' : 'bg-accent/10 text-accent'
                  }`}
                >
                  {i + 1}
                </span>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openSheet(n.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    sel ? 'border-accent bg-accent/10' : 'border-border/10 bg-surface-2'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-content">
                    <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{n.label}</span>
                  </span>
                  <span className="block text-xs text-content-muted mt-1">{n.summary}</span>
                  {(ins.length > 0 || outs.length > 0) && (
                    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {ins.map((ty) => <WireTag key={`i${ty}`} type={ty} label={`← ${typeLabel(ty)}`} />)}
                      {outs.map((ty) => <WireTag key={`o${ty}`} type={ty} label={`${typeLabel(ty)} →`} />)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Feuille modale (dialog natif : focus piégé, Échap, retour du focus) */}
      <dialog
        ref={sheetRef}
        aria-label={node?.label}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-0 mt-auto w-full max-w-none max-h-[85dvh] rounded-t-2xl border border-border/10 bg-surface p-0 text-content backdrop:bg-surface/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border/10 px-4 py-3">
            <span className="text-xs font-semibold tracking-wider text-accent">
              {t.flowUi.step} {index + 1} {t.flowUi.of} {order.length}
            </span>
            <button
              type="button"
              onClick={() => sheetRef.current?.close()}
              aria-label={t.flowUi.close}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-content-muted hover:text-content"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain p-4">{panel}</div>
          <div className="flex gap-3 border-t border-border/10 px-4 py-3">
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => step(-1)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border border-border/10 bg-glass text-sm font-medium text-content-muted disabled:opacity-40"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              {t.flowUi.prev}
            </button>
            <button
              type="button"
              disabled={index >= order.length - 1}
              onClick={() => step(1)}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border border-accent/50 bg-accent/10 text-sm font-medium text-content disabled:opacity-40"
            >
              {t.flowUi.next}
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </dialog>

      {showLegend && (present.length > 0 || hasNeutral) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-xs uppercase tracking-wide text-content-faint">{t.flowUi.legend}</span>
          {present.map((w) => <WireTag key={w} type={w} label={w} />)}
          {hasNeutral && <WireTag label={neutral} />}
        </div>
      )}
    </div>
  );
};
