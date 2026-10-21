import { useEffect, useState, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

const ids = ["home", "about", "experience", "projects", "contact"];
const duration = 760;

export function FullPageExperience({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const desktop = matchMedia("(min-width:1101px) and (pointer:fine)");
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const panels = ids.map((id) => document.getElementById(id)!);
    let active = 0,
      target = -1,
      transitioning = false,
      frame = 0;
    let lastWheel = 0,
      spentGesture = false,
      accumulated = 0;
    let scrollTimer: ReturnType<typeof setTimeout>;
    let effects: ReturnType<typeof animate>[] = [];
    let disposed = false;
    const enhanced = () => desktop.matches && !reduced;
    const content = (index: number) =>
      panels[index].querySelector<HTMLElement>(".panel-content");
    const resetEffects = () => {
      effects.forEach((effect) => effect.stop());
      effects = [];
      panels.forEach((panel) => {
        const node = panel.querySelector<HTMLElement>(".panel-content");
        if (node) {
          node.style.opacity = "";
          node.style.transform = "";
        }
      });
      document.documentElement.removeAttribute("data-transitioning");
    };
    const update = (
      index: number,
      historyMode: "push" | "replace" | "none",
    ) => {
      active = index;
      setCurrent(index);
      document.querySelectorAll(".navigation a").forEach((link) => {
        if (link.getAttribute("href") === `#${ids[index]}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (historyMode !== "none" && location.hash !== `#${ids[index]}`)
        history[historyMode === "push" ? "pushState" : "replaceState"](
          null,
          "",
          `#${ids[index]}`,
        );
    };
    const navigate = (index: number, historyMode: "push" | "none" = "push") => {
      index = Math.max(0, Math.min(ids.length - 1, index));
      if (transitioning && target === index) return;
      const previous = active;
      cancelAnimationFrame(frame);
      resetEffects();
      transitioning = false;
      target = index;
      const start = window.scrollY,
        finish = panels[index].offsetTop;
      update(index, historyMode);
      if (!enhanced() || Math.abs(finish - start) < 2) {
        window.scrollTo({ top: finish, behavior: "instant" });
        target = -1;
        return;
      }
      transitioning = true;
      document.documentElement.setAttribute("data-transitioning", "true");
      const outgoing = content(previous),
        incoming = content(index);
      if (outgoing && previous !== index)
        effects.push(
          animate(
            outgoing,
            { opacity: [1, 0], y: [0, index > previous ? -16 : 16] },
            { duration: 0.38, ease: "easeInOut" },
          ),
        );
      if (incoming && previous !== index)
        effects.push(
          animate(
            incoming,
            { opacity: [0, 1], y: [index > previous ? 40 : -40, 0] },
            { duration: 0.76, ease: [0.22, 1, 0.36, 1] },
          ),
        );
      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - began) / duration);
        const ease =
          progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({
          top: start + (finish - start) * ease,
          behavior: "instant",
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else {
          transitioning = false;
          target = -1;
          resetEffects();
        }
      };
      frame = requestAnimationFrame(tick);
    };
    const wheel = (event: WheelEvent) => {
      if (
        !enhanced() ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      const now = performance.now(),
        quiet = now - lastWheel > 180;
      lastWheel = now;
      if (quiet) {
        spentGesture = false;
        accumulated = 0;
      }
      if (transitioning || spentGesture) {
        event.preventDefault();
        return;
      }
      if (!event.deltaY) return;
      // Allow independently scrollable descendants to consume their own wheel input.
      for (
        let node = event.target as HTMLElement | null;
        node && node !== document.body;
        node = node.parentElement
      ) {
        if (
          node.scrollHeight > node.clientHeight + 2 &&
          /(auto|scroll)/.test(getComputedStyle(node).overflowY)
        ) {
          const canScroll =
            event.deltaY > 0
              ? node.scrollTop + node.clientHeight < node.scrollHeight - 2
              : node.scrollTop > 2;
          if (canScroll) return;
        }
      }
      const direction = event.deltaY > 0 ? 1 : -1;
      const panel = panels[active],
        top = panel.offsetTop,
        bottom = top + panel.offsetHeight - innerHeight;
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      // Native scrolling inside tall sections; clamp only a gesture that overshoots its boundary.
      if (
        (direction > 0 && scrollY < bottom - 3) ||
        (direction < 0 && scrollY > top + 3)
      ) {
        const remaining = direction > 0 ? bottom - scrollY : scrollY - top;
        if (Math.abs(delta) > remaining) {
          event.preventDefault();
          window.scrollTo({
            top: direction > 0 ? bottom : top,
            behavior: "instant",
          });
          spentGesture = true;
        }
        return;
      }
      const next = active + direction;
      if (next < 0 || next >= ids.length) return;
      event.preventDefault();
      accumulated =
        accumulated && Math.sign(accumulated) !== direction
          ? delta
          : accumulated + delta;
      if (Math.abs(accumulated) < 35) return;
      spentGesture = true;
      accumulated = 0;
      navigate(next);
    };
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (
        !anchor ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const index = ids.indexOf(anchor.hash.slice(1));
      if (index < 0) return;
      event.preventDefault();
      navigate(index);
      // Native anchor navigation moves the reading/Tab position as well as the viewport.
      const heading = panels[index].querySelector<HTMLElement>("h1,h2");
      heading?.focus({ preventScroll: true });
    };
    const key = (event: KeyboardEvent) => {
      if (
        !enhanced() ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      if (
        (event.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"],dialog,[role="slider"]',
        )
      )
        return;
      let index: number;
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = 4;
      else if (event.key === "PageDown" || event.key === "PageUp") {
        const direction = event.key === "PageDown" ? 1 : -1,
          panel = panels[active];
        if (
          (direction > 0 &&
            scrollY < panel.offsetTop + panel.offsetHeight - innerHeight - 3) ||
          (direction < 0 && scrollY > panel.offsetTop + 3)
        )
          return;
        index = active + direction;
      } else return;
      event.preventDefault();
      if (!transitioning) navigate(index);
    };
    const historyChange = () => {
      const index = ids.indexOf(location.hash.slice(1));
      navigate(index < 0 ? 0 : index, "none");
    };
    const scroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (transitioning || disposed) return;
        const index = panels.reduce(
          (found, panel, i) =>
            panel.offsetTop <= scrollY + innerHeight * 0.35 ? i : found,
          0,
        );
        update(index, "replace");
      }, 120);
    };
    const mediaChange = () => {
      const wasMoving = transitioning;
      cancelAnimationFrame(frame);
      transitioning = false;
      target = -1;
      resetEffects();
      if (wasMoving)
        window.scrollTo({ top: panels[active].offsetTop, behavior: "instant" });
    };
    panels.forEach((panel) =>
      panel.querySelector("h1,h2")?.setAttribute("tabindex", "-1"),
    );
    window.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("click", click);
    window.addEventListener("keydown", key);
    window.addEventListener("popstate", historyChange);
    window.addEventListener("hashchange", historyChange);
    window.addEventListener("scroll", scroll, { passive: true });
    desktop.addEventListener("change", mediaChange);
    window.addEventListener("resize", mediaChange);
    historyChange();
    return () => {
      history.scrollRestoration = restoration;
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(scrollTimer);
      resetEffects();
      window.removeEventListener("wheel", wheel);
      document.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
      window.removeEventListener("popstate", historyChange);
      window.removeEventListener("hashchange", historyChange);
      window.removeEventListener("scroll", scroll);
      desktop.removeEventListener("change", mediaChange);
      window.removeEventListener("resize", mediaChange);
    };
  }, [reduced]);
  return (
    <>
      <main>{children}</main>
      <div
        className="section-indicator"
        aria-label={`현재 섹션 ${current + 1} / 5`}
      >
        <strong>{String(current + 1).padStart(2, "0")}</strong>
        <span> / 05</span>
      </div>
    </>
  );
}
