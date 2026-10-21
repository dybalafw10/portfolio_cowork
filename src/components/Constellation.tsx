import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

// An open center: only six perimeter connections, with no decorative nodes.
const connections = [
  ["weather", "science"],
  ["science", "ibk"],
  ["ibk", "mg"],
  ["mg", "kiat"],
  ["kiat", "seoul"],
  ["seoul", "weather"],
] as const;

interface Props {
  container: RefObject<HTMLElement | null>;
  active: string | null;
}

export function Constellation({ container, active }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = container.current;
    const layer = svg.current;
    if (!root || !layer) return;
    let frame = 0;
    let disposed = false;
    const marks = new Map(
      [...root.querySelectorAll<HTMLButtonElement>("[data-organization]")].map(
        (mark) => [mark.dataset.organization!, mark],
      ),
    );
    const lines = [...layer.querySelectorAll("line")];

    const draw = () => {
      const origin = root.getBoundingClientRect();
      // Read every layout rect before writing attributes. No React renders per frame.
      const bounds = new Map(
        [...marks].map(([id, mark]) => [id, mark.getBoundingClientRect()]),
      );
      connections.forEach(([from, to], index) => {
        const a = bounds.get(from),
          b = bounds.get(to);
        if (!a || !b) return;
        const ax = a.x + a.width / 2,
          ay = a.y + a.height / 2;
        const bx = b.x + b.width / 2,
          by = b.y + b.height / 2;
        const dx = bx - ax,
          dy = by - ay;
        // Stop just outside the actual transformed logo bounds, including hover scale.
        const edge = (rect: DOMRect) =>
          Math.min(
            dx ? (rect.width / 2 + 10) / Math.abs(dx) : Infinity,
            dy ? (rect.height / 2 + 10) / Math.abs(dy) : Infinity,
            0.45,
          );
        const start = edge(a),
          end = edge(b);
        const line = lines[index];
        line.setAttribute("x1", String(ax + dx * start - origin.x));
        line.setAttribute("y1", String(ay + dy * start - origin.y));
        line.setAttribute("x2", String(bx - dx * end - origin.x));
        line.setAttribute("y2", String(by - dy * end - origin.y));
      });
      if (!reduced && !disposed) frame = requestAnimationFrame(draw);
    };
    const refresh = () => {
      if (!reduced || disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    draw();
    const observer = new ResizeObserver(refresh);
    observer.observe(root);
    marks.forEach((mark) => observer.observe(mark));
    window.addEventListener("resize", refresh);
    void document.fonts.ready.then(refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [container, reduced, active]);

  return (
    <svg
      ref={svg}
      className="constellation"
      aria-hidden="true"
      focusable="false"
    >
      {connections.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          data-from={from}
          data-to={to}
          className={
            active === from || active === to ? "is-connected" : undefined
          }
        />
      ))}
    </svg>
  );
}
