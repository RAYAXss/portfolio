import type { Flow, FlowNode } from '../types/flow';

const MAX_COL = 4; // 5 colonnes : le graphe tient dans max-w-5xl sans mise à l'échelle

const byPosition = (a: FlowNode, b: FlowNode) => a.col - b.col || a.row - b.row;

/** Ordre topologique (Kahn) ; parmi les nœuds prêts, le plus à gauche puis le plus haut passe d'abord. */
export function topoOrder(flow: Flow): FlowNode[] {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const indegree = new Map(flow.nodes.map((n) => [n.id, 0]));
  for (const e of flow.edges) {
    if (byId.has(e.from) && byId.has(e.to)) indegree.set(e.to, (indegree.get(e.to) ?? 0) + 1);
  }
  const ready = [...byId.values()].filter((n) => indegree.get(n.id) === 0);
  const order: FlowNode[] = [];
  while (ready.length) {
    ready.sort(byPosition);
    const node = ready.shift() as FlowNode;
    order.push(node);
    for (const e of flow.edges) {
      if (e.from !== node.id || !byId.has(e.to)) continue;
      const left = (indegree.get(e.to) ?? 0) - 1;
      indegree.set(e.to, left);
      if (left === 0) ready.push(byId.get(e.to) as FlowNode);
    }
  }
  return order;
}

/** Erreurs de structure d'un graphe ([] si OK). */
export function validateFlow(flow: Flow): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const cells = new Map<string, string>();
  for (const n of flow.nodes) {
    if (ids.has(n.id)) errors.push(`duplicate id "${n.id}"`);
    ids.add(n.id);
    const cell = `${n.col},${n.row}`;
    const other = cells.get(cell);
    if (other) errors.push(`"${other}" and "${n.id}" share cell (${cell})`);
    else cells.set(cell, n.id);
    if (n.col > MAX_COL) errors.push(`"${n.id}" col ${n.col} > ${MAX_COL}`);
    if (!n.summary?.trim() || !n.detail?.trim()) errors.push(`"${n.id}" missing summary/detail`);
    for (const p of n.params ?? []) if (!p.explain.trim()) errors.push(`"${n.id}" param "${p.name}" has empty explain`);
  }
  for (const e of flow.edges) {
    for (const end of [e.from, e.to]) if (!ids.has(end)) errors.push(`edge ${e.from} -> ${e.to}: unknown node "${end}"`);
  }
  if (topoOrder(flow).length < ids.size) errors.push('cycle detected');
  return errors;
}
