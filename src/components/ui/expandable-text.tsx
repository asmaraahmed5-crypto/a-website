import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ExpandableTextProps extends React.ComponentProps<'div'> {
  /** Lines shown while collapsed. */
  lines?: number;
  moreLabel?: string;
  lessLabel?: string;
}

/**
 * Expandable Text (from 21st.dev, "Expandable Text" by balick), adapted: no gradient fade
 * (solid colours only), project tokens. Long text is clamped to a few lines with a toggle
 * that only appears when the content actually overflows.
 */
export function ExpandableText({ lines = 3, moreLabel = 'Show more', lessLabel = 'Show less', className, children, ...props }: ExpandableTextProps) {
  const id = React.useId();
  const content = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [heights, setHeights] = React.useState<{ collapsed: number; full: number }>();

  React.useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const measure = () => {
      const style = getComputedStyle(node);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
      setHeights({ collapsed: Math.round(lineHeight * lines), full: node.scrollHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [lines]);

  const overflows = !heights || heights.full > heights.collapsed + 1;
  const open = expanded || !overflows;

  return (
    <div className={cn(className)} {...props}>
      <div id={id} className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none" style={heights ? { height: open ? heights.full : heights.collapsed } : { maxHeight: `${lines}lh` }}>
        <div ref={content}>{children}</div>
      </div>
      {overflows && (
        <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded((v) => !v)} className="mt-2 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline">
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}

export default ExpandableText;
