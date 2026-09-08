import { useId } from "react";

/* One tablist for the whole page.

   There were three of these, written separately: the case selector in Use
   cases, the level-of-detail tabs in Supported systems, and the stage list in
   How it works. All three hand-rolled the same roving tabIndex and the same
   arrow-key handler, and they had drifted: two supported Home and End and one
   did not, and each moved focus a different way.

   The differences that were real are props. `orientation` picks which arrow
   keys step the selection, because a vertical tablist takes Up and Down rather
   than Left and Right. `renderItem` keeps each one's own contents, and
   `tabId` / `panelId` let a caller keep an id scheme its panels already use,
   and `labelFor` supplies an accessible name where the rendered contents are
   not text. It brings no styling of its own: the three tablists look nothing
   alike, so each passes the classes it wants.

   Focus follows selection synchronously, from the buttons already in the
   document, so no caller needs an effect to chase it after a re-render. */
export function Tabs({
  items,
  selected,
  onChange,
  label,
  orientation = "horizontal",
  className = "",
  renderItem,
  tabId,
  panelId,
  labelFor,
}) {
  const generated = useId();
  const idFor = (item, index) =>
    tabId ? tabId(item, index) : `${generated}-${index}`;
  const controlsFor = (item, index) =>
    typeof panelId === "function" ? panelId(item, index) : panelId;
  const [prev, next] =
    orientation === "vertical"
      ? ["ArrowUp", "ArrowDown"]
      : ["ArrowLeft", "ArrowRight"];

  return (
    <div
      className={className}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      style={{ "--selected-tab": selected }}
      onKeyDown={(event) => {
        if (![prev, next, "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const buttons = [...event.currentTarget.querySelectorAll("button")];
        const focused = buttons.indexOf(event.target.closest("button"));
        const current = focused < 0 ? selected : focused;
        const target =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : (current + (event.key === next ? 1 : -1) + items.length) %
                items.length;
        onChange(target);
        buttons[target].focus();
      }}
    >
      {items.map((item, index) => (
        <button
          type="button"
          role="tab"
          key={idFor(item, index)}
          id={idFor(item, index)}
          aria-label={labelFor ? labelFor(item, index) : undefined}
          aria-selected={selected === index}
          aria-controls={controlsFor(item, index)}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => onChange(index)}
        >
          {renderItem ? renderItem(item, index) : item}
        </button>
      ))}
    </div>
  );
}
