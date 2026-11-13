import React, { useEffect, useMemo, useState } from 'react';
import { Download, Package, Type, Layers, Sparkles, ScanLine, SlidersHorizontal, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Flow, FlowEdge, FlowNode, FlowNodeKind, WireType } from '../../types/flow';
import { topoOrder } from '../../utils/flow';
import { useLanguage } from '../../hooks/useLanguage';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const NODE_W = 168;
const NODE_H = 60;
const COL_GAP = 48;
const ROW_GAP = 20;
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
  const sy = s.row * (NODE_H + ROW_GAP) + NODE_H / 2;
  const tx = t.col * (NODE_W + COL_GAP);
  const ty = t.row * (NODE_H + ROW_GAP) + NODE_H / 2;
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
  useEffect(() => {
    if (selectedId !== selected) setSelected(selectedId);
  }, [selectedId, selected]);

  const node = byId.get(selectedId);
  const activeId = hoverId ?? selectedId;
  const neutral = t.flowUi.neutralWire;
  const typeLabel = (type?: WireType) => type ?? neutral;
  const cols = Math.max(...flow.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...flow.nodes.map((n) => n.row)) + 1;
  const width = cols * (NODE_W + COL_GAP) - COL_GAP;
  const height = rows * (NODE_H + ROW_GAP) - ROW_GAP;
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
    <div aria-live="polite" className="rounded-xl border border-border/10 bg-surface-2 p-4 sm:p-5 space-y-4">
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
      {/* >= lg : graphe câblé */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto pb-2">
          <div className="relative mx-auto" style={{ width, height }}>
            <svg className="absolute inset-0" width={width} height={height} aria-hidden="true">
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
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(n.id)}
                  onBlur={() => setHoverId(null)}
                  style={{ left: n.col * (NODE_W + COL_GAP), top: n.row * (NODE_H + ROW_GAP), width: NODE_W, height: NODE_H }}
                  className={`absolute flex items-center gap-2 px-3 rounded-lg border text-left text-sm font-medium text-content transition-colors ${
                    sel ? 'border-accent bg-accent/10' : 'border-border/10 bg-surface-2 hover:border-accent/50'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
                  <span className="leading-tight">{n.label}</span>
                </button>
              );
            })}
            {hoverNode && (
              <div
                role="tooltip"
                style={{
                  left: Math.min(hoverNode.col * (NODE_W + COL_GAP), width - 224),
                  top: hoverNode.row * (NODE_H + ROW_GAP) + NODE_H + 4,
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

      {/* < lg : liste ordonnée */}
      <ol className="lg:hidden space-y-2">
        {order.map((n) => {
          const sel = n.id === selectedId;
          const ins = [...new Set(links('in', n.id).map((e) => e.type))];
          const outs = [...new Set(links('out', n.id).map((e) => e.type))];
          return (
            <li key={n.id}>
              <button
                type="button"
                aria-pressed={sel}
                onClick={() => setSelected(n.id)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  sel ? 'border-accent bg-accent/10' : 'border-border/10 bg-surface-2'
                }`}
              >
                <span className="block text-sm font-medium text-content">{n.label}</span>
                <span className="block text-xs text-content-muted mt-0.5">{n.summary}</span>
                {(ins.length > 0 || outs.length > 0) && (
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {ins.map((ty) => <WireTag key={`i${ty}`} type={ty} label={`← ${typeLabel(ty)}`} />)}
                    {outs.map((ty) => <WireTag key={`o${ty}`} type={ty} label={`${typeLabel(ty)} →`} />)}
                  </span>
                )}
              </button>
              {sel && <div className="mt-2">{panel}</div>}
            </li>
          );
        })}
      </ol>

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
