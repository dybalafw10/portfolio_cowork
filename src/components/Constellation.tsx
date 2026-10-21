import { useEffect, useRef, type RefObject } from "react";
import { constellationClusters } from "../data/constellations";

export function Constellation({
  container,
  active,
}: {
  container: RefObject<HTMLElement | null>;
  active: string | null;
}) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const root = container.current,
      layer = svg.current;
    if (!root || !layer) return;
    let disposed = false,
      frame = 0;
    const organizations = constellationClusters.map((cluster) =>
      root.querySelector<HTMLElement>(`.organization-${cluster.organization}`)!,
    );
    const groups = [...layer.querySelectorAll<SVGGElement>("[data-cluster]")];
    const brand = root.querySelector<HTMLElement>(".brand")!;
    const footer = root.querySelector<HTMLElement>(".hero-bottom")!;
    const header = document.querySelector<HTMLElement>(".navigation")!;

    const draw = () => {
      if (disposed) return;
      const origin = layer.getBoundingClientRect();
      if (!origin.width || !origin.height) return;
      const compact = origin.width <= 1100;
      const bounds = organizations.map((element) =>
        element.getBoundingClientRect(),
      );
      const brandBottom = brand.offsetTop + brand.offsetHeight;
      const footerBounds = footer.getBoundingClientRect();
      // Header is fixed; use its height so scrolling the Hero does not change the layout.
      const headerHeight = header.getBoundingClientRect().height;
      const layouts = constellationClusters.map((cluster, i) => {
        const r = bounds[i];
        const top = cluster.placement.startsWith("top");
        const left = cluster.placement.endsWith("left");
        let width = cluster.width,
          height = cluster.height,
          x: number,
          y: number;
        if (compact) {
          width = Math.min(width, r.width - 24);
          if (top) {
            height = Math.min(
              height,
              Math.max(24, r.top - origin.y - brandBottom - 26),
            );
            y = r.top - origin.y - height - 14;
          } else {
            height = Math.min(
              height,
              Math.max(24, footerBounds.top - r.bottom - 24),
            );
            y = r.bottom - origin.y + 8;
          }
          x = r.left - origin.x + (r.width - width) / 2;
        } else if (top) {
          height = Math.min(
            height,
            Math.max(24, r.top - origin.y - headerHeight - 30),
          );
          x = r.left - origin.x + r.width / 2 - width * (left ? 0.72 : 0.28);
          y = r.top - origin.y - height - 16;
        } else {
          // Below the title, outside the reserved logo/project text column.
          const textWidth = 290;
          const center = r.left - origin.x + r.width / 2;
          const available = left
            ? center - textWidth / 2 - 40
            : origin.width - (center + textWidth / 2) - 40;
          width = Math.min(width, Math.max(50, available));
          x = left
            ? center - textWidth / 2 - width - 16
            : center + textWidth / 2 + 16;
          y = r.top - origin.y + 8;
        }
        x = Math.max(12, Math.min(origin.width - width - 12, x));
        y = Math.max(
          headerHeight + 10,
          Math.min(origin.height - height - 36, y),
        );
        return { x, y, width, height };
      });
      layer.setAttribute("viewBox", `0 0 ${origin.width} ${origin.height}`);
      constellationClusters.forEach((cluster, i) => {
        const layout = layouts[i];
        const positions = new Map(
          cluster.nodes.map((node) => [
            node.id,
            {
              x: layout.x + node.x * layout.width,
              y: layout.y + node.y * layout.height,
            },
          ]),
        );
        // Both lines and dots resolve from this exact same node map.
        groups[i].querySelectorAll("circle").forEach((circle) => {
          const node = positions.get(circle.dataset.node!)!;
          circle.setAttribute("cx", String(node.x));
          circle.setAttribute("cy", String(node.y));
        });
        groups[i].querySelectorAll("line").forEach((line) => {
          const from = positions.get(line.dataset.from!)!,
            to = positions.get(line.dataset.to!)!;
          line.setAttribute("x1", String(from.x));
          line.setAttribute("y1", String(from.y));
          line.setAttribute("x2", String(to.x));
          line.setAttribute("y2", String(to.y));
        });
      });
      layer.setAttribute("data-ready", "true");
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(refresh);
    [layer, brand, footer, header, ...organizations].forEach((element) =>
      resize.observe(element),
    );
    window.addEventListener("resize", refresh);
    void document.fonts.ready.then(refresh);
    refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [container]);
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
      {constellationClusters.map((cluster) => (
        <g
          key={cluster.id}
          data-cluster={cluster.id}
          data-organization-link={cluster.organization}
          className={
            active === cluster.organization ? "is-connected" : undefined
          }
        >
          {cluster.edges.map(([from, to]) => (
            <line key={`${from}-${to}`} data-from={from} data-to={to} />
          ))}
          {cluster.nodes.map((node) => (
            <circle key={node.id} data-node={node.id} r="1.7" />
          ))}
        </g>
      ))}
    </svg>
  );
}
