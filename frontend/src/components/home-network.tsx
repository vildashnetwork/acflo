import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { ActionLink, Button } from './site';

const NetworkScene = lazy(() => import('./network-scene'));
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <div className="grid h-full place-items-center text-primary-foreground">ACFLO · Connected across Africa</div> : this.props.children; }
}

export function HomeNetwork() {
  const host = useRef<HTMLElement>(null);
  const [colors, setColors] = useState<string[] | null>(null);
  const [rotating, setRotating] = useState(true);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const styles = getComputedStyle(element);
    setColors(['--scene-green', '--scene-white'].map(token => styles.getPropertyValue(token).trim()));
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setRotating(!media.matches);
    update(); media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(element);
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  return <section ref={host} aria-labelledby="network-visual-title" className="relative overflow-hidden bg-deep text-primary-foreground">
    <div className="container-site relative z-10 pt-12 md:pt-16 pointer-events-none">
      <p className="eyebrow !text-lime">One continent. Shared possibilities.</p>
      <h2 id="network-visual-title" className="mt-4 max-w-xl font-display text-3xl font-bold md:text-4xl">ACFLO. Stronger connections.</h2>
      <p className="mt-4 max-w-lg text-sm leading-7 opacity-75">Local voices at the heart of a connected Africa.</p>
    </div>
    <div role="img" aria-label="Interactive three-dimensional sculpture of connected nodes" className="h-[360px] w-full cursor-grab active:cursor-grabbing md:h-[460px]">
      {colors && visible && <SceneBoundary><Suspense fallback={<div className="grid h-full place-items-center text-sm">ACFLO</div>}><NetworkScene colors={colors} rotating={rotating} /></Suspense></SceneBoundary>}
    </div>
    <div className="container-site flex items-center justify-between gap-4 pb-10">
      <ActionLink to="/network" variant="light">Meet the network <ArrowUpRight size={16} /></ActionLink>
      <Button variant="light" onClick={() => setRotating(value => !value)} aria-label={rotating ? 'Pause 3D rotation' : 'Play 3D rotation'} title={rotating ? 'Pause 3D rotation' : 'Play 3D rotation'} className="!size-11 !p-0">{rotating ? <Pause size={18} /> : <Play size={18} />}</Button>
    </div>
  </section>;
}