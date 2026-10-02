import type { Child, SafeHtml } from "@kx/jsx-runtime";

/**
 * Accessible tabs (WAI-ARIA tabs pattern). Server renders every panel; the
 * client script hides inactive panels and adds arrow-key navigation. Without
 * JavaScript all panels remain visible in order, so nothing is lost.
 */
export function Tabs(props: { id: string; label: string; tabs: { key: string; label: string; panel: Child }[] }): SafeHtml {
  return (
    <div class="tabs" data-tabs>
      <div class="tabs__list" role="tablist" aria-label={props.label}>
        {props.tabs.map((t, i) => (
          <button
            type="button"
            role="tab"
            class="tabs__tab"
            id={`${props.id}-tab-${t.key}`}
            aria-controls={`${props.id}-panel-${t.key}`}
            aria-selected={i === 0 ? "true" : "false"}
            tabindex={i === 0 ? "0" : "-1"}
          >
            {t.label}
          </button>
        ))}
      </div>
      {props.tabs.map((t) => (
        <div class="tabs__panel" role="tabpanel" id={`${props.id}-panel-${t.key}`} aria-labelledby={`${props.id}-tab-${t.key}`} tabindex="0">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
