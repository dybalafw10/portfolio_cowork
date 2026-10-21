import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

// Disconnected, asymmetric fragments. Never form a perimeter or a shared network.
const fragments = [
  { id: "weather", dx: 36, dy: -27 },
  { id: "ibk", dx: -28, dy: 39 },
  { id: "kiat", dx: 48, dy: 19 },
] as const;
const independent = [
  [0.075, 0.29, 0.105, 0.265],
  [0.84, 0.12, 0.866, 0.15],
  [0.6, 0.81, 0.64, 0.795],
  [0.92, 0.67, 0.935, 0.71],
];

export function Constellation({
  container,
  active,
}: {
  container: RefObject<HTMLElement | null>;
  active: string | null;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = container.current,
      layer = svg.current;
    if (!root || !layer) return;
    let frame = 0,
      visible = true,
      disposed = false;
    const lines = [...layer.querySelectorAll("line")];
    const dots = [...layer.querySelectorAll("circle")];
    const marks = fragments.map(({ id }) =>
      root.querySelector<HTMLElement>(`[data-organization="${id}"]`),
    );
    const draw = () => {
      const origin = layer.getBoundingClientRect();
      if (!origin.width || !origin.height) return;
      const viewBox = `0 0 ${origin.width} ${origin.height}`;
      if (layer.getAttribute("viewBox") !== viewBox)
        layer.setAttribute("viewBox", viewBox);
      const bounds = marks.map((mark) => mark?.getBoundingClientRect());
      const compact = origin.width <= 1100;
      const brand = root.querySelector(".brand")!.getBoundingClientRect();
      const field = root
        .querySelector(".organization-field")!
        .getBoundingClientRect();
      const set = (
        index: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => {
        Object.entries({ x1, y1, x2, y2 }).forEach(([key, value]) =>
          lines[index].setAttribute(key, String(value)),
        );
        dots[index].setAttribute("cx", String(x2));
        dots[index].setAttribute("cy", String(y2));
      };
      fragments.forEach(({ dx, dy }, i) => {
        const r = bounds[i];
        if (!r) return;
        if (compact && fragments[i].id === "kiat") {
          const x = r.left + r.width / 2 - origin.x,
            y = r.top - origin.y - 8;
          set(i, x, y, x + 22, y - 24);
          return;
        }
        const x = (dx > 0 ? r.right + 8 : r.left - 8) - origin.x;
        const y = r.top + r.height / 2 - origin.y;
        set(
          i,
          x,
          y,
          x + dx * (compact ? 0.55 : 1),
          y + dy * (compact ? 0.8 : 1),
        );
      });
      independent.forEach(([x1, y1, x2, y2], i) => {
        let startY = y1 * origin.height,
          endY = y2 * origin.height;
        if (compact && i === 0) {
          startY = brand.bottom - origin.y + 24;
          endY = startY - 12;
        }
        if (compact && i === 1) {
          startY = 100;
          endY = 118;
        }
        if (compact && i === 2) {
          startY = field.bottom - origin.y + 12;
          endY = startY + 13;
        }
        set(
          i + fragments.length,
          x1 * origin.width,
          startY,
          x2 * origin.width,
          endY,
        );
      });
      layer.setAttribute("data-ready", "true");
      if (!reduced && visible && !disposed) frame = requestAnimationFrame(draw);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      if (!disposed) draw();
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(root);
    resize.observe(layer);
    marks.forEach((mark) => mark && resize.observe(mark));
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    intersection.observe(root);
    window.addEventListener("resize", refresh);
    void document.fonts.ready.then(refresh);
    refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [container, reduced, active]);
  return (
    <svg
      ref={svg}
      className="constellation"
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {fragments.map(({ id }) => (
        <line
          key={id}
          data-from={id}
          className={active === id ? "is-connected" : undefined}
        />
      ))}
      {independent.map((_, i) => (
        <line key={`independent-${i}`} />
      ))}
      {[...fragments, ...independent].map((_, i) => (
        <circle key={`point-${i}`} r="0.9" />
      ))}
    </svg>
  );
}
