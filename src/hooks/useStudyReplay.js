import { useEffect, useRef, useState } from "react";

export function useStudyReplay(
  selected,
  intro,
  answer,
  stepCount,
  conclusion,
  question,
) {
  const ref = useRef(null);
  const followRef = useRef(true);
  const [frame, setFrame] = useState({ selected, stage: -1, chars: 0, plans: 0 });
  useEffect(() => {
    followRef.current = true;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const position = window.scrollY;
      if (position < lastScroll - 2) followRef.current = false;
      else if (position > lastScroll && ref.current) {
        const bottom = ref.current.getBoundingClientRect().bottom;
        if (bottom <= window.innerHeight + 48) followRef.current = true;
      }
      lastScroll = position;
    };
    const onWheel = (event) => {
      if (event.deltaY < 0) followRef.current = false;
    };
    const onKey = (event) => {
      if (["ArrowUp", "PageUp", "Home"].includes(event.key))
        followRef.current = false;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (
        !followRef.current ||
        Number(element.dataset.replayStage) <= 0 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const bottom = element.getBoundingClientRect().bottom;
      if (bottom > window.innerHeight - 24) {
        window.scrollBy({
          top: bottom - window.innerHeight + 24,
          behavior: "instant",
        });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [selected]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let cancelled = false;
    let started = false;
    const show = (stage, chars = 0, plans = 0) => {
      if (!cancelled) setFrame({ selected, stage, chars, plans });
    };
    const later = (fn, delay) => {
      timer = window.setTimeout(fn, delay);
    };
    const stream = (stage, text, done) => {
      const begin = performance.now();
      const duration = stage === 1 ? 800 : stage === 4 ? 1000 : 600;
      const tick = () => {
        const fraction = Math.min(1, (performance.now() - begin) / duration);
        const chars = Math.ceil(text.length * fraction);
        show(stage, chars, stepCount);
        if (fraction < 1) later(tick, 20);
        else later(done, 100);
      };
      tick();
    };
    const beginReply = () => {
      later(
        () =>
          stream(1, intro, () => {
            let plans = 0;
            const plan = () => {
              show(2, intro.length, ++plans);
              if (plans < stepCount) later(plan, 400 / Math.max(1, stepCount - 1));
              else
                later(() => {
                  show(3, intro.length, stepCount);
                  later(
                    () =>
                      stream(4, answer, () => {
                        show(5, answer.length, stepCount);
                        later(
                          () =>
                            stream(6, conclusion, () =>
                              show(7, conclusion.length, stepCount),
                            ),
                          800,
                        );
                      }),
                    650,
                  );
                }, 200);
            };
            plan();
          }),
        1000,
      );
    };
    const run = () => {
      if (started || cancelled) return;
      started = true;
      const words = question.trim().split(/\s+/);
      let count = 0;
      const tick = () => {
        show(-1, ++count);
        if (count < words.length) later(tick, 65);
        else {
          show(0);
          beginReply();
        }
      };
      tick();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.05 },
    );
    const onMotion = () => {
      if (motion.matches) {
        window.clearTimeout(timer);
        observer.disconnect();
        started = true;
        show(7, conclusion.length, stepCount);
      }
    };
    show(-1);
    if (motion.matches) onMotion();
    else if (ref.current) observer.observe(ref.current);
    motion.addEventListener("change", onMotion);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
    };
  }, [selected, intro, answer, stepCount, conclusion, question]);
  return {
    ref,
    ...(frame.selected === selected ? frame : { stage: -1, chars: 0, plans: 0 }),
  };
}
