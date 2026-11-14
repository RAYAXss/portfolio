import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

/** Onglets accessibles (WAI-ARIA tablist) dont l'onglet actif vit dans l'URL (`?param=id`). */
export const Tabs: React.FC<{
  items: TabItem[];
  param: string;
  ariaLabel: string;
  children: (activeId: string) => React.ReactNode;
}> = ({ items, param, ariaLabel, children }) => {
  const [params, setParams] = useSearchParams();
  const wanted = params.get(param);
  const activeId = items.find((i) => i.id === wanted)?.id ?? items[0].id;
  const tabId = (id: string) => `${param}-tab-${id}`;

  const select = (id: string, focus = false) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(param, id);
        return next;
      },
      { replace: true },
    );
    if (focus) document.getElementById(tabId(id))?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const target =
      e.key === 'ArrowRight' ? (index + 1) % items.length
      : e.key === 'ArrowLeft' ? (index - 1 + items.length) % items.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? items.length - 1
      : -1;
    if (target < 0) return;
    e.preventDefault();
    select(items[target].id, true);
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {items.map(({ id, label, icon: Icon }, i) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              id={tabId(id)}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`${param}-panel-${id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                active
                  ? 'border-accent/50 bg-accent/10 text-content'
                  : 'border-border/10 bg-glass text-content-muted hover:bg-glass-hover hover:text-content'
              }`}
            >
              {Icon && <Icon size={16} aria-hidden="true" />}
              {label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`${param}-panel-${activeId}`} aria-labelledby={tabId(activeId)} tabIndex={0}>
        {children(activeId)}
      </div>
    </div>
  );
};
