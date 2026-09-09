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
  const [frame, setFrame] = useState({ selected, stage: -1, chars: 0, plans: 0 });
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let cancelled = false;
    let started = false;
    let visible = false;
    let pending = null;
    let remaining = 0;
    let due = 0;
    let activeTime = 0;
    let resumedAt = 0;
    let playing = false;
    const now = () => activeTime + (playing ? performance.now() - resumedAt : 0);
    const schedule = () => {
      if (!playing || !pending) return;
      due = performance.now() + remaining;
      timer = window.setTimeout(() => {
        const fn = pending;
        pending = null;
        fn();
      }, remaining);
    };
    const show = (stage, chars = 0, plans = 0) => {
      if (!cancelled) setFrame({ selected, stage, chars, plans });
    };
    const later = (fn, delay) => {
      pending = fn;
      remaining = delay;
      schedule();
    };
    const stream = (stage, text, done) => {
      const begin = now();
      const duration = stage === 1 ? 800 : stage === 4 ? 1000 : 600;
      const tick = () => {
        const fraction = Math.min(1, (now() - begin) / duration);
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
    // Count only visible playback time, including partial streaming and delays.
    const updatePlayback = () => {
      const next = visible && !document.hidden && !motion.matches;
      if (next === playing) return;
      if (next) {
        playing = true;
        resumedAt = performance.now();
        if (!started) run();
        else schedule();
      } else {
        activeTime = now();
        playing = false;
        window.clearTimeout(timer);
        if (pending) remaining = Math.max(0, due - performance.now());
      }
      if (ref.current) ref.current.dataset.replayPaused = String(!next);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0 },
    );
    const onMotion = () => {
      if (motion.matches) {
        updatePlayback();
        window.clearTimeout(timer);
        pending = null;
        observer.disconnect();
        started = true;
        show(7, conclusion.length, stepCount);
      }
    };
    if (ref.current) ref.current.dataset.replayPaused = "true";
    show(-1);
    if (motion.matches) onMotion();
    else if (ref.current) observer.observe(ref.current);
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [selected, intro, answer, stepCount, conclusion, question]);
  return {
    ref,
    ...(frame.selected === selected ? frame : { stage: -1, chars: 0, plans: 0 }),
  };
}
