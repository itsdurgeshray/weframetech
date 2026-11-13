'use client';

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode; /** px per second */ speed?: number };

/** Hidden copy of the children: no alt text or screen-reader output for repeats. */
function hiddenCopy(children: ReactNode, rep: number) {
  return Children.map(children, (child, i) =>
    isValidElement<Record<string, unknown>>(child)
      ? cloneElement(child, { key: `r${rep}-${i}`, 'aria-hidden': true, ...(child.type === 'img' ? { alt: '' } : {}) })
      : child,
  );
}

/**
 * Infinite marquee. Repeats the set until it is wider than the screen, then mirrors it once,
 * so translateX(-50%) loops seamlessly at any width. Speed stays constant in px/s.
 */
export default function Marquee({ children, speed = 46, className, ...rest }: Props) {
  const setRef = useRef<HTMLDivElement>(null);
  const unit = useRef(0);
  const [reps, setReps] = useState(1);
  const [dur, setDur] = useState<string>();

  useEffect(() => {
    if (document.documentElement.classList.contains('figma')) return;
    const fit = () => {
      const set = setRef.current;
      if (!set) return;
      if (!unit.current) unit.current = set.scrollWidth; // measured with a single copy
      const need = Math.max(1, Math.ceil((innerWidth * 1.1) / unit.current));
      setReps(need);
      setDur(((unit.current * need) / speed).toFixed(1) + 's');
    };
    fit();
    let last = innerWidth;
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => { if (Math.abs(innerWidth - last) > 80) { last = innerWidth; fit(); } }, 250);
    };
    addEventListener('resize', onResize);
    return () => { removeEventListener('resize', onResize); clearTimeout(t); };
  }, [speed]);

  const extra = Array.from({ length: reps - 1 }, (_, r) => hiddenCopy(children, r + 1));
  const mirror = Array.from({ length: reps }, (_, r) => hiddenCopy(children, r + 100));

  return (
    <div className={className} {...rest}>
      <div className="track" style={dur ? ({ '--dur': dur } as CSSProperties) : undefined}>
        <div className="set" ref={setRef}>
          {children}
          {extra}
        </div>
        <div className="set" aria-hidden="true">
          {mirror}
        </div>
      </div>
    </div>
  );
}
